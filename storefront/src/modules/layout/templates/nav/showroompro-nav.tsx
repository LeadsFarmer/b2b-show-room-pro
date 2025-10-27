import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import AccountButton from "@/modules/account/components/account-button"
import CartButton from "@/modules/cart/components/cart-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import FilePlus from "@/modules/common/icons/file-plus"
import { MegaMenuWrapper } from "@/modules/layout/components/mega-menu"
import { RequestQuoteConfirmation } from "@/modules/quotes/components/request-quote-confirmation"
import { RequestQuotePrompt } from "@/modules/quotes/components/request-quote-prompt"
import SkeletonAccountButton from "@/modules/skeletons/components/skeleton-account-button"
import SkeletonCartButton from "@/modules/skeletons/components/skeleton-cart-button"
import SkeletonMegaMenu from "@/modules/skeletons/components/skeleton-mega-menu"
import { Building2, Search } from "lucide-react"
import { Suspense } from "react"

export async function ShowRoomProNav() {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart()

  return (
    <div className="sticky top-0 inset-x-0 group bg-white text-zinc-900 border-b duration-200 border-neutral-200 z-50">
      <header className="content-container py-3">
        <div className="flex justify-between items-center">
          {/* Logo + Menu */}
          <div className="flex items-center gap-6">
            <LocalizedClientLink
              className="hover:text-ui-fg-base flex items-center gap-2"
              href="/"
            >
              <Building2 className="w-7 h-7 text-blue-600" />
              <h1 className="text-lg font-bold text-neutral-950 hidden small:block">
                Show Room Pro
              </h1>
            </LocalizedClientLink>

            {/* Menu Desktop */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-1">
                <li>
                  <Suspense fallback={<SkeletonMegaMenu />}>
                    <MegaMenuWrapper />
                  </Suspense>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    Tous les produits
                  </LocalizedClientLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Actions: Recherche + Devis + Connexion + Panier */}
          <div className="flex items-center gap-3">
            {/* Recherche */}
            <LocalizedClientLink 
              href="/search" 
              className="relative hidden small:flex items-center bg-neutral-100 pl-10 pr-4 py-2 rounded-full hover:bg-neutral-200 transition-all"
            >
              <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
              <span className="text-sm text-neutral-600">Rechercher...</span>
            </LocalizedClientLink>

            <div className="h-5 w-px bg-neutral-300 hidden small:block" />

            {/* Devis */}
            {customer && cart?.items && cart.items.length > 0 ? (
              <RequestQuoteConfirmation>
                <button className="flex gap-2 items-center rounded-md hover:bg-neutral-100 px-3 py-2 transition-colors">
                  <FilePlus className="w-4 h-4" />
                  <span className="hidden small:inline-block text-sm font-medium">
                    Devis
                  </span>
                </button>
              </RequestQuoteConfirmation>
            ) : (
              <RequestQuotePrompt>
                <button className="flex gap-2 items-center rounded-md hover:bg-neutral-100 px-3 py-2 transition-colors">
                  <FilePlus className="w-4 h-4" />
                  <span className="hidden small:inline-block text-sm font-medium">
                    Devis
                  </span>
                </button>
              </RequestQuotePrompt>
            )}

            {/* Connexion */}
            <Suspense fallback={<SkeletonAccountButton />}>
              <AccountButton customer={customer} />
            </Suspense>

            {/* Panier */}
            <Suspense fallback={<SkeletonCartButton />}>
              <CartButton />
            </Suspense>
          </div>
        </div>
      </header>
    </div>
  )
}
