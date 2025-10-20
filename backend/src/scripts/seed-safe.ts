import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/core-flows";
import {
  ExecArgs,
  IFulfillmentModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";

export default async function seedDemoDataSafe({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService: IFulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );
  const salesChannelModuleService: ISalesChannelModuleService =
    container.resolve(ModuleRegistrationName.SALES_CHANNEL);
  const storeModuleService: IStoreModuleService = container.resolve(
    ModuleRegistrationName.STORE
  );
  const regionModuleService: IRegionModuleService = container.resolve(
    ModuleRegistrationName.REGION
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  // Check if region already exists
  logger.info("Checking existing regions...");
  const existingRegions = await regionModuleService.listRegions({
    name: "Europe",
  });

  let region;
  if (existingRegions.length > 0) {
    logger.info("Region 'Europe' already exists, skipping creation");
    region = existingRegions[0];
  } else {
    logger.info("Creating region...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info("Finished creating region.");
  }

  // Continue with tax regions, stock locations, products, etc.
  logger.info("Seeding stock location data...");
  const stockLocationService = container.resolve("stockLocationService") as any;
  const stockLocations = await stockLocationService.list();
  
  let stockLocation;
  if (stockLocations.length > 0) {
    logger.info("Stock location already exists");
    stockLocation = stockLocations[0];
  } else {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "European Warehouse",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  }

  logger.info("Seeding fulfillment data...");
  const shippingProfileService = container.resolve("shippingProfileService") as any;
  const shippingProfiles = await shippingProfileService.list();
  
  let shippingProfile;
  if (shippingProfiles.length > 0) {
    logger.info("Shipping profile already exists");
    shippingProfile = shippingProfiles[0];
  } else {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets();
  
  let fulfillmentSet;
  if (fulfillmentSets.length > 0) {
    logger.info("Fulfillment set already exists");
    fulfillmentSet = fulfillmentSets[0];
  } else {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: countries.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "eur",
              amount: 10,
            },
            {
              region_id: region.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: '"true"',
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("Seeding product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Laptops", is_active: true },
        { name: "Accessories", is_active: true },
        { name: "Phones", is_active: true },
        { name: "Monitors", is_active: true },
      ],
    },
  });

  logger.info("Seeding collection...");
  const {
    result: [collection],
  } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        {
          title: "Featured",
          handle: "featured",
        },
      ],
    },
  });

  logger.info("Seeding products... (this may take a while)");
  
  // Create one sample product (you can add more from the original seed.ts if needed)
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: '16" Ultra-Slim AI Laptop | 3K OLED | 1.1cm Thin | 6-Speaker Audio',
          collection_id: collection.id,
          category_ids: [
            categoryResult.find((cat) => cat.name === "Laptops")?.id!,
          ],
          description:
            "This ultra-thin 16-inch laptop is a sophisticated, high-performance machine for the new era of artificial intelligence.",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/laptop-front.png",
            },
          ],
          options: [
            {
              title: "Storage",
              values: ["256 GB", "512 GB"],
            },
          ],
          variants: [
            {
              title: "256 GB",
              sku: "LAPTOP-256",
              options: {
                Storage: "256 GB",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 1299,
                  currency_code: "eur",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });

  logger.info("✅ Finished seeding product data!");
}
