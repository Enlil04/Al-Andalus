export const contactInfo = {
  shortcode: "7366",
  phone: "+964 771 000 6000",
  phoneHref: "tel:+9647710006000",
  branches: [
    {
      id: "baghdad",
      label: "Headquarters",
      area: "Al-Arasat Street, Baghdad, Iraq",
      mapEmbedUrl: "https://maps.google.com/maps?q=Al-Andalus+International+Insurance+Baghdad,+Iraq&hl=en&z=15&ie=UTF8&iwloc=&output=embed",
      mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Al-Andalus+International+Insurance+Baghdad,+Iraq"
    },
    {
      id: "basrah",
      label: "Basrah Branch",
      area: "Al-Ashar Commercial District, Basrah, Iraq",
      mapEmbedUrl: "https://maps.google.com/maps?q=Al-Andalus+International+Insurance+Basrah,+Iraq&hl=en&z=15&ie=UTF8&iwloc=&output=embed",
      mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Al-Andalus+International+Insurance+Basrah,+Iraq"
    },
    {
      id: "erbil",
      label: "Erbil Branch",
      area: "Gulan Street, Erbil, Iraq",
      mapEmbedUrl: "https://maps.google.com/maps?q=Al-Andalus+International+Insurance+Erbil,+Iraq&hl=en&z=15&ie=UTF8&iwloc=&output=embed",
      mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Al-Andalus+International+Insurance+Erbil,+Iraq"
    },
  ],
} as const;

export function getContactInfo(locale: string) {
  return {
    shortcode: "7366",
    phone: "+964 771 000 6000",
    phoneHref: "tel:+9647710006000",
    branches: [
      {
        id: "baghdad",
        label: locale === "ar" ? "المقر الرئيسي" : "Headquarters",
        area: locale === "ar" ? "شارع العرصات، بغداد، العراق" : "Al-Arasat Street, Baghdad, Iraq",
        mapEmbedUrl: `https://maps.google.com/maps?q=Al-Andalus+International+Insurance+Baghdad,+Iraq&hl=${locale}&z=15&ie=UTF8&iwloc=&output=embed`,
        mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Al-Andalus+International+Insurance+Baghdad,+Iraq"
      },
      {
        id: "basrah",
        label: locale === "ar" ? "فرع البصرة" : "Basrah Branch",
        area: locale === "ar" ? "المنطقة التجارية بالعشار، البصرة، العراق" : "Al-Ashar Commercial District, Basrah, Iraq",
        mapEmbedUrl: `https://maps.google.com/maps?q=Al-Andalus+International+Insurance+Basrah,+Iraq&hl=${locale}&z=15&ie=UTF8&iwloc=&output=embed`,
        mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Al-Andalus+International+Insurance+Basrah,+Iraq"
      },
      {
        id: "erbil",
        label: locale === "ar" ? "فرع أربيل" : "Erbil Branch",
        area: locale === "ar" ? "شارع جولان، أربيل، العراق" : "Gulan Street, Erbil, Iraq",
        mapEmbedUrl: `https://maps.google.com/maps?q=Al-Andalus+International+Insurance+Erbil,+Iraq&hl=${locale}&z=15&ie=UTF8&iwloc=&output=embed`,
        mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Al-Andalus+International+Insurance+Erbil,+Iraq"
      },
    ],
  };
}
