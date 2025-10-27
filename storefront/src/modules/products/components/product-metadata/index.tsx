import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"

interface ProductMetadataProps {
  product: HttpTypes.StoreProduct
}

const ProductMetadata = ({ product }: ProductMetadataProps) => {
  const metadata = product.metadata as Record<string, any>

  if (!metadata || Object.keys(metadata).length === 0) {
    return null
  }

  // Extraction des métadonnées
  const supplierName = metadata.supplier_name
  const supplierCountry = metadata.supplier_country
  const supplierCity = metadata.supplier_city
  const supplierWebsite = metadata.supplier_website
  const waterproof = metadata.waterproof
  const batteryMah = metadata.battery_mah
  const batteryLife = metadata.battery_life
  const chargingTime = metadata.charging_time
  const cameraSpecs = metadata.camera_specs
  const storage = metadata.storage
  const connectivity = metadata.connectivity
  const dimensions = metadata.dimensions
  const radarRange = metadata.radar_range_m
  const moq = metadata.moq
  const innovation = metadata.innovation
  const priceMinUsd = metadata.price_min_usd
  const priceMaxUsd = metadata.price_max_usd

  const hasSupplierInfo = supplierName || supplierCountry || supplierCity
  const hasTechnicalSpecs =
    waterproof ||
    batteryMah ||
    cameraSpecs ||
    storage ||
    connectivity ||
    dimensions ||
    radarRange
  const hasB2BInfo = moq || priceMinUsd || priceMaxUsd

  // Si aucune métadonnée pertinente, ne rien afficher
  if (!hasSupplierInfo && !hasTechnicalSpecs && !hasB2BInfo) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {/* Fournisseur */}
      {hasSupplierInfo && (
        <Container className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="p-4">
            <h3 className="text-sm font-bold text-neutral-950 mb-3 flex items-center gap-2">
              🏭 Fournisseur
            </h3>
            <div className="space-y-2 text-sm">
              {supplierName && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600 min-w-[80px]">Nom:</span>
                  <span className="font-medium text-neutral-950">
                    {supplierName}
                  </span>
                </div>
              )}
              {(supplierCity || supplierCountry) && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600 min-w-[80px]">
                    Localisation:
                  </span>
                  <span className="text-neutral-800">
                    {supplierCity}
                    {supplierCity && supplierCountry && ", "}
                    {supplierCountry}
                  </span>
                </div>
              )}
              {supplierWebsite && supplierWebsite !== "N/A" && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600 min-w-[80px]">Site:</span>
                  <a
                    href={
                      supplierWebsite.startsWith("http")
                        ? supplierWebsite
                        : `https://${supplierWebsite}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {supplierWebsite}
                  </a>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}

      {/* Spécifications Techniques */}
      {hasTechnicalSpecs && (
        <Container className="bg-white border border-neutral-200">
          <div className="p-4">
            <h3 className="text-sm font-bold text-neutral-950 mb-3 flex items-center gap-2">
              🔧 Spécifications Techniques
            </h3>
            <div className="grid grid-cols-1 small:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {waterproof && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">💧 Étanchéité:</span>
                  <span className="font-medium text-blue-700">
                    {waterproof}
                  </span>
                </div>
              )}
              {batteryMah && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">🔋 Batterie:</span>
                  <span className="text-neutral-800">
                    {batteryMah} mAh
                    {batteryLife && ` (${batteryLife})`}
                  </span>
                </div>
              )}
              {chargingTime && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">⚡ Charge:</span>
                  <span className="text-neutral-800">{chargingTime}</span>
                </div>
              )}
              {cameraSpecs && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">📸 Caméra:</span>
                  <span className="text-neutral-800">{cameraSpecs}</span>
                </div>
              )}
              {storage && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">💾 Stockage:</span>
                  <span className="text-neutral-800">{storage}</span>
                </div>
              )}
              {connectivity && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">📡 Connectivité:</span>
                  <span className="text-neutral-800">{connectivity}</span>
                </div>
              )}
              {dimensions && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">📏 Dimensions:</span>
                  <span className="text-neutral-800">{dimensions}</span>
                </div>
              )}
              {radarRange && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600">📡 Portée radar:</span>
                  <span className="text-neutral-800">{radarRange} m</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}

      {/* Informations B2B */}
      {hasB2BInfo && (
        <Container className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="p-4">
            <h3 className="text-sm font-bold text-neutral-950 mb-3 flex items-center gap-2">
              📦 Informations B2B
            </h3>
            <div className="space-y-2 text-sm">
              {moq && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600 min-w-[120px]">
                    MOQ (Minimum):
                  </span>
                  <span className="font-bold text-green-700">
                    {moq} unités
                  </span>
                </div>
              )}
              {(priceMinUsd || priceMaxUsd) && (
                <div className="flex items-start gap-2">
                  <span className="text-neutral-600 min-w-[120px]">
                    Prix indicatif:
                  </span>
                  <span className="text-neutral-800">
                    {priceMinUsd && `$${priceMinUsd}`}
                    {priceMinUsd && priceMaxUsd && " - "}
                    {priceMaxUsd && `$${priceMaxUsd}`} USD
                    <span className="text-xs text-neutral-500 ml-2">
                      (contactez-nous pour devis)
                    </span>
                  </span>
                </div>
              )}
              {innovation && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                    ⭐ PRODUIT INNOVANT
                  </span>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}
    </div>
  )
}

export default ProductMetadata
