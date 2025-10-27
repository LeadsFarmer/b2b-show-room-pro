import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/core-flows";
import {
  ExecArgs,
  IFulfillmentModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";

export default async function seedDemoData({ container }: ExecArgs) {
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

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
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
  logger.info("Seeding region data...");
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
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
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
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
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
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
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
            currency_code: "usd",
            amount: 10,
          },
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
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
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
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

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

  // ========================================
  // 🇫🇷 STRUCTURE DE CATÉGORIES B2B - SHOWROOMPRO
  // ========================================
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        // ========================================
        // 📱 TECH GRAND PUBLIC
        // ========================================
        {
          name: "Tech Grand Public",
          handle: "tech",
          description: "Solutions technologiques innovantes pour le grand public : traqueurs, wearables, audio premium",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "📱",
            display_order: 1,
            b2b: {
              moq_min: 10,
              moq_max: 500,
              price_range: "15-200€",
              lead_time: "15-30 jours",
              branding_available: true,
              certifications: ["CE", "FCC", "RoHS"],
            },
          },
        },
        {
          name: "Traqueurs & Find My",
          handle: "tech/trackers-find-my",
          description: "Traqueurs Bluetooth et compatibles Find My Network pour localiser objets et animaux",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "📍",
            parent: "Tech Grand Public",
            keywords: ["tracker", "find my", "bluetooth", "GPS", "localisation", "anti-perte"],
            b2b: {
              moq_min: 20,
              moq_suggested: 50,
              price_range: "15-45€",
              lead_time: "20-25 jours",
              customization: ["Logo gravé", "Emballage personnalisé", "Couleurs custom"],
              target_markets: ["Tech accessories", "Pet care", "Travel"],
            },
          },
        },
        {
          name: "Wearables & Montres Connectées",
          handle: "tech/wearables",
          description: "Montres connectées, bracelets fitness et wearables intelligents",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "⌚",
            parent: "Tech Grand Public",
            keywords: ["smartwatch", "fitness", "health", "wearable", "sport"],
            b2b: {
              moq_min: 10,
              moq_suggested: 30,
              price_range: "50-200€",
              lead_time: "25-35 jours",
              certifications: ["IP67/IP68", "CE", "FDA (si health)"],
              customization: ["Cadrans custom", "Packaging premium", "App branding"],
            },
          },
        },
        {
          name: "Lunettes AI & Smart Glasses",
          handle: "tech/lunettes-ai",
          description: "Lunettes intelligentes avec AI, audio intégré et réalité augmentée",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🕶️",
            parent: "Tech Grand Public",
            keywords: ["smart glasses", "AI", "audio", "augmented reality", "meta", "rayban"],
            b2b: {
              moq_min: 5,
              moq_suggested: 20,
              price_range: "120-350€",
              lead_time: "30-45 jours",
              innovation_level: "high",
              target_markets: ["Fashion tech", "Enterprise AR", "Content creators"],
            },
          },
        },
        {
          name: "Audio Open-Ear & ANC",
          handle: "tech/audio",
          description: "Écouteurs open-ear, ANC premium et audio haute fidélité",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🎧",
            parent: "Tech Grand Public",
            keywords: ["earbuds", "ANC", "open-ear", "bone conduction", "audio", "wireless"],
            b2b: {
              moq_min: 20,
              moq_suggested: 100,
              price_range: "35-150€",
              lead_time: "20-30 jours",
              certifications: ["Hi-Res Audio", "AptX", "IPX4+"],
              customization: ["Case branding", "Couleurs", "App customization"],
            },
          },
        },

        // ========================================
        // 🖼️ PLV NUMÉRIQUE & RETAIL
        // ========================================
        {
          name: "PLV Numérique & Signalétique",
          handle: "plv",
          description: "Solutions d'affichage dynamique pour retail : hologrammes 3D, LED HDMI, light boxes",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🖼️",
            display_order: 2,
            b2b: {
              moq_min: 1,
              moq_max: 50,
              price_range: "200-2000€",
              lead_time: "30-60 jours",
              branding_available: true,
              installation_support: true,
            },
          },
        },
        {
          name: "Hologrammes 3D & Ventilateurs LED",
          handle: "plv/hologrammes-3d",
          description: "Affichage holographique 3D par ventilateur LED pour retail et événementiel",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "✨",
            parent: "PLV Numérique & Signalétique",
            keywords: ["hologram", "3D", "LED fan", "advertising", "retail display", "wow effect"],
            b2b: {
              moq_min: 1,
              moq_suggested: 5,
              price_range: "300-800€",
              lead_time: "35-45 jours",
              customization: ["Contenu vidéo custom", "Logo integration", "Taille ajustable"],
              target_markets: ["Retail", "Events", "Museums", "Luxury brands"],
              technical_specs: {
                sizes: ["42cm", "65cm", "100cm"],
                resolution: "1024px ou plus",
                wifi_app_control: true,
              },
            },
          },
        },
        {
          name: "Barres LED HDMI Temps Réel",
          handle: "plv/barres-led-hdmi",
          description: "Barres LED avec entrée HDMI pour affichage dynamique synchronisé en temps réel",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "💡",
            parent: "PLV Numérique & Signalétique",
            keywords: ["LED bar", "HDMI", "Govee", "Philips Hue", "ambient light", "gaming"],
            b2b: {
              moq_min: 10,
              moq_suggested: 50,
              price_range: "80-250€",
              lead_time: "25-35 jours",
              customization: ["Longueur custom", "App branding", "Packaging"],
              target_markets: ["Gaming", "Home cinema", "Retail ambiance", "Streamers"],
            },
          },
        },
        {
          name: "Light Boxes & Signalétique Lumineuse",
          handle: "plv/light-boxes",
          description: "Caissons lumineux LED pour signalétique et affichage publicitaire",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🔆",
            parent: "PLV Numérique & Signalétique",
            keywords: ["lightbox", "LED sign", "backlit", "signage", "retail", "storefront"],
            b2b: {
              moq_min: 5,
              moq_suggested: 20,
              price_range: "150-600€",
              lead_time: "30-40 jours",
              customization: ["Taille sur mesure", "Impression custom", "Montage mural/suspendu"],
              target_markets: ["Retail", "Restaurant", "Real estate", "Events"],
            },
          },
        },

        // ========================================
        // 🚴 MOBILITÉ & SÉCURITÉ
        // ========================================
        {
          name: "Mobilité & Sécurité",
          handle: "mobilite",
          description: "Solutions de sécurité pour cyclistes et voyageurs intelligents",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🚴",
            display_order: 3,
            b2b: {
              moq_min: 10,
              moq_max: 200,
              price_range: "40-300€",
              lead_time: "25-40 jours",
              waterproof: true,
              certifications_required: ["IP65+", "CE"],
            },
          },
        },
        {
          name: "Sécurité Vélo",
          handle: "mobilite/securite-velo",
          description: "Radars arrière, dashcams vélo, feux intelligents et accessoires de sécurité cycliste",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🚲",
            parent: "Mobilité & Sécurité",
            keywords: ["bike radar", "dashcam", "bike light", "cycling safety", "garmin varia"],
            b2b: {
              moq_min: 10,
              moq_suggested: 30,
              price_range: "60-250€",
              lead_time: "30-40 jours",
              waterproof: "IP65-IP67",
              customization: ["Packaging", "Manual multilingue", "App co-branding"],
              target_markets: ["Bike shops", "Sports retailers", "Urban mobility"],
            },
          },
        },
        {
          name: "Accessoires Voyage Intelligents",
          handle: "mobilite/voyage-intelligent",
          description: "Valises connectées, trackers bagages, adaptateurs universels intelligents",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "✈️",
            parent: "Mobilité & Sécurité",
            keywords: ["luggage tracker", "travel adapter", "smart suitcase", "TSA", "USB-C PD"],
            b2b: {
              moq_min: 20,
              moq_suggested: 100,
              price_range: "25-180€",
              lead_time: "25-35 jours",
              certifications: ["TSA approved", "CE", "Flight safe"],
              customization: ["Logo embossed", "Color options", "Retail packaging"],
              target_markets: ["Travel retail", "Airport shops", "Corporate gifts"],
            },
          },
        },

        // ========================================
        // 😁 BEAUTY & SMILE CARE
        // ========================================
        {
          name: "Beauty & Smile Care",
          handle: "beauty",
          description: "Soins dentaires professionnels et solutions de blanchiment",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "😁",
            display_order: 4,
            b2b: {
              moq_min: 50,
              moq_max: 1000,
              price_range: "8-120€",
              lead_time: "20-35 jours",
              fda_ce_compliant: true,
              private_label: true,
            },
          },
        },
        {
          name: "Blanchiment Dentaire",
          handle: "beauty/blanchiment",
          description: "Kits de blanchiment, bandes, gels et accessoires pour un sourire éclatant",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "✨",
            parent: "Beauty & Smile Care",
            keywords: ["teeth whitening", "whitening strips", "gel", "PAP", "peroxide-free"],
            b2b: {
              moq_min: 100,
              moq_suggested: 500,
              price_range: "8-35€",
              lead_time: "25-35 jours",
              certifications: ["CE", "FDA", "ISO 13485"],
              private_label: true,
              customization: ["Packaging custom", "Formule adaptée", "Branding complet"],
              target_markets: ["Dental", "Beauty", "E-commerce", "Pharmacies"],
            },
          },
        },
        {
          name: "Brosses à Dents Électriques & Appareils",
          handle: "beauty/appareils-dentaires",
          description: "Brosses à dents électriques LED, hydrojets dentaires et soins bucco-dentaires avancés",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: "🦷",
            parent: "Beauty & Smile Care",
            keywords: ["electric toothbrush", "water flosser", "dental care", "oral irrigator", "LED therapy"],
            b2b: {
              moq_min: 20,
              moq_suggested: 100,
              price_range: "25-120€",
              lead_time: "30-40 jours",
              certifications: ["CE", "RoHS", "Waterproof IPX7"],
              customization: ["Logo", "Couleurs", "Packaging premium"],
              target_markets: ["Dental practices", "Beauty stores", "Wellness retailers"],
            },
          },
        },
        
        // ========================================
        // 🔄 COMPATIBILITÉ: Anciennes catégories pour produits existants
        // ========================================
        {
          name: "Laptops",
          handle: "tech/laptops",
          description: "Ordinateurs portables et laptops professionnels",
          is_active: true,
          metadata: { parent: "Tech Grand Public", legacy: true },
        },
        {
          name: "Accessories",
          handle: "tech/accessories",
          description: "Accessoires technologiques variés",
          is_active: true,
          metadata: { parent: "Tech Grand Public", legacy: true },
        },
        {
          name: "Phones",
          handle: "tech/phones",
          description: "Smartphones et téléphones intelligents",
          is_active: true,
          metadata: { parent: "Tech Grand Public", legacy: true },
        },
        {
          name: "Monitors",
          handle: "tech/monitors",
          description: "Écrans et moniteurs professionnels",
          is_active: true,
          metadata: { parent: "Tech Grand Public", legacy: true },
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title:
            '16" Ultra-Slim AI Laptop | 3K OLED | 1.1cm Thin | 6-Speaker Audio',
          collection_id: collection.id,
          category_ids: [
            categoryResult.find((cat) => cat.name === "Laptops")?.id!,
          ],
          description:
            "This ultra-thin 16-inch laptop is a sophisticated, high-performance machine for the new era of artificial intelligence. It has been completely redesigned from the inside out. The cabinet features an exquisite new ceramic-aluminum composite material in a range of nature-inspired colors. This material provides durability while completing the ultra-slim design and resisting the test of time. This innovative computer utilizes the latest AI-enhanced processor with quiet ambient cooling. It's designed to enrich your lifestyle on the go with an astonishingly thin 1.1cm chassis that houses an advanced 16-inch 3K OLED display and immersive six-speaker audio.",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/laptop-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/laptop-side.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/laptop-top.png",
            },
          ],
          options: [
            {
              title: "Storage",
              values: ["256 GB", "512 GB"],
            },
            {
              title: "Color",
              values: ["Blue", "Red"],
            },
          ],
          variants: [
            {
              title: "256 GB / Blue",
              sku: "256-BLUE",
              options: {
                Storage: "256 GB",
                Color: "Blue",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 1299,
                  currency_code: "eur",
                },
                {
                  amount: 1299,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "512 GB / Red",
              sku: "512-RED",
              options: {
                Storage: "512 GB",
                Color: "Red",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 1259,
                  currency_code: "eur",
                },
                {
                  amount: 1259,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "1080p HD Pro Webcam | Superior Video | Privacy enabled",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Accessories")?.id!,
          ],
          description:
            "High-quality 1080p HD webcam that elevates your work environment with superior video and audio that outperforms standard laptop cameras. Achieve top-tier video collaboration at a cost-effective price point, ideal for widespread deployment across your organization.",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/camera-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/camera-side.png",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "Webcam Black",
              sku: "WEBCAM-BLACK",
              options: {
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 59,
                  currency_code: "eur",
                },
                {
                  amount: 59,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Webcam White",
              sku: "WEBCAM-WHITE",
              options: {
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 65,
                  currency_code: "eur",
                },
                {
                  amount: 65,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: `6.5" Ultra HD Smartphone | 3x Impact-Resistant Screen`,
          collection_id: collection.id,
          category_ids: [
            categoryResult.find((cat) => cat.name === "Phones")?.id!,
          ],
          description:
            'This premium smartphone is crafted from durable and lightweight aerospace-grade aluminum, featuring an expansive 6.5" Ultra-High Definition AMOLED display. It boasts exceptional durability with a cutting-edge nanocrystal glass front, offering three times the impact resistance of standard smartphone screens. The device combines sleek design with robust protection, setting a new standard for smartphone resilience and visual excellence. Copy',
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/phone-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/phone-side.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/phone-bottom.png",
            },
          ],
          options: [
            {
              title: "Memory",
              values: ["256 GB", "512 GB"],
            },
            {
              title: "Color",
              values: ["Purple", "Red"],
            },
          ],
          variants: [
            {
              title: "256 GB Purple",
              sku: "PHONE-256-PURPLE",
              options: {
                Memory: "256 GB",
                Color: "Purple",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 999,
                  currency_code: "eur",
                },
                {
                  amount: 999,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "256 GB Red",
              sku: "PHONE-256-RED",
              options: {
                Memory: "256 GB",
                Color: "Red",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 959,
                  currency_code: "eur",
                },
                {
                  amount: 959,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: `34" QD-OLED Curved Gaming Monitor | Ultra-Wide | Infinite Contrast | 175Hz`,
          collection_id: collection.id,
          category_ids: [
            categoryResult.find((cat) => cat.name === "Monitors")?.id!,
          ],
          description:
            "Experience the pinnacle of display technology with this 34-inch curved monitor. By merging OLED panels and Quantum Dot technology, this QD-OLED screen delivers exceptional contrast, deep blacks, unlimited viewing angles, and vivid colors. The curved design provides an immersive experience, allowing you to enjoy the best of both worlds in one cutting-edge display. This innovative monitor represents the ultimate fusion of visual performance and immersive design.",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/screen-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/screen-side.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/screen-top.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/screen-back.png",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["White", "Black"],
            },
          ],
          variants: [
            {
              title: "ACME Monitor 4k White",
              sku: "ACME-MONITOR-WHITE",
              options: {
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 599,
                  currency_code: "eur",
                },
                {
                  amount: 599,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "ACME Monitor 4k White",
              sku: "ACME-MONITOR-BLACK",
              options: {
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 599,
                  currency_code: "eur",
                },
                {
                  amount: 599,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Hi-Fi Gaming Headset | Pro-Grade DAC | Hi-Res Certified",
          collection_id: collection.id,
          category_ids: [
            categoryResult.find((cat) => cat.name === "Accessories")?.id!,
          ],
          description: `Experience studio-quality audio with this advanced acoustic system, which pairs premium hardware with high-fidelity sound and innovative audio software for an immersive listening experience. The integrated digital-to-analog converter (DAC) enhances the audio setup with high-resolution certification and a built-in amplifier, delivering exceptional sound clarity and depth. This comprehensive audio solution brings professional-grade sound to your personal environment, whether for gaming, music production, or general entertainment.`,
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/headphone-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/headphone-side.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/headphone-top.png",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "Headphone Black",
              sku: "HEADPHONE-BLACK",
              options: {
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 149,
                  currency_code: "eur",
                },
                {
                  amount: 149,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Headphone White",
              sku: "HEADPHONE-WHITE",
              options: {
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 149,
                  currency_code: "eur",
                },
                {
                  amount: 149,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Wireless Keyboard | Touch ID | Numeric Keypad",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Accessories")?.id!,
          ],
          description: `This wireless keyboard offers a comfortable typing experience with a numeric keypad and Touch ID. It features navigation buttons, full-sized arrow keys, and is ideal for spreadsheets and gaming. The rechargeable battery lasts about a month. It pairs automatically with compatible computers and includes a USB-C to Lightning cable for charging and pairing.`,
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/keyboard-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/keyboard-side.png",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "Keyboard Black",
              sku: "KEYBOARD-BLACK",
              options: {
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 99,
                  currency_code: "eur",
                },
                {
                  amount: 99,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Keyboard White",
              sku: "KEYBOARD-WHITE",
              options: {
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 99,
                  currency_code: "eur",
                },
                {
                  amount: 99,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Wireless Rechargeable Mouse | Multi-Touch Surface",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Accessories")?.id!,
          ],
          description: `This wireless keyboard offers a comfortable typing experience with a numeric keypad and Touch ID. It features navigation buttons, full-sized arrow keys, and is ideal for spreadsheets and gaming. The rechargeable battery lasts about a month. It pairs automatically with compatible computers and includes a USB-C to Lightning cable for charging and pairing.`,
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/mouse-top.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/mouse-front.png",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "Mouse Black",
              sku: "MOUSE-BLACK",
              options: {
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 79,
                  currency_code: "eur",
                },
                {
                  amount: 79,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Mouse White",
              sku: "MOUSE-WHITE",
              options: {
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 79,
                  currency_code: "eur",
                },
                {
                  amount: 79,
                  currency_code: "usd",
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

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Conference Speaker | High-Performance | Budget-Friendly",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Accessories")?.id!,
          ],
          description: `This compact, powerful conference speaker offers exceptional, high-performance features at a surprisingly affordable price. Packed with advanced productivity-enhancing technology, it delivers premium functionality without the premium price tag. Experience better meetings and improved communication, regardless of where your team members are calling from.`,
          weight: 400,
          status: ProductStatus.PUBLISHED,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/speaker-top.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/speaker-front.png",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "Speaker Black",
              sku: "SPEAKER-BLACK",
              options: {
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 79,
                  currency_code: "eur",
                },
                {
                  amount: 79,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Speaker White",
              sku: "SPEAKER-WHITE",
              options: {
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 55,
                  currency_code: "eur",
                },
                {
                  amount: 55,
                  currency_code: "usd",
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

  logger.info("Finished seeding product data.");
}
