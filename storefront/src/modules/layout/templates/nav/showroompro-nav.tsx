import { ShowRoomProNavbar } from "@/components/blocks/showroompro-navbar"

export function ShowRoomProNav() {
  return (
    <ShowRoomProNavbar
      logo={{
        url: "/",
        src: "/logo.svg",
        alt: "Show Room Pro B2B",
        title: "Show Room Pro",
      }}
      menu={[
        { title: "Accueil", url: "/" },
        {
          title: "Produits",
          url: "/store",
        },
        {
          title: "Catégories",
          url: "/categories",
        },
        {
          title: "Compte",
          url: "/account",
        },
      ]}
      mobileExtraLinks={[
        { name: "Contact", url: "/contact" },
        { name: "CGV", url: "/terms" },
      ]}
      auth={{
        login: { text: "Connexion", url: "/account/login" },
        signup: { text: "Créer un compte", url: "/account/register" },
      }}
    />
  )
}
