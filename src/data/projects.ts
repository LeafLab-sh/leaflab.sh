export type Project = {
  name: string;
  description: string;
  tags: string[];
  link: { href: string; label: string };
  status?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "The Goods",
    description:
      "A player-driven economy mod for Minecraft — prices move with supply and demand instead of a fixed price sheet. Live on CurseForge with more content in progress.",
    tags: ["Minecraft", "Game Dev", "Java"],
    link: {
      href: "https://www.curseforge.com/minecraft/mc-mods/the-goods",
      label: "View on CurseForge",
    },
    status: "In active development",
    featured: true,
  },
  {
    name: "SiK Radio Tripod Mount",
    description:
      "A 3D-printed tripod mount for the Holybro SiK telemetry radio, designed for a stable field setup.",
    tags: ["3D Printing", "Remote Control"],
    link: { href: "https://ko-fi.com/leafbot/shop", label: "View in shop" },
  },
  {
    name: "RoboRIO Signal Light Mount",
    description:
      "Attaches a FIRST Robotics signal light directly to the RoboRIO's mounting holes.",
    tags: ["3D Printing", "FIRST Robotics"],
    link: { href: "https://ko-fi.com/leafbot/shop", label: "View in shop" },
  },
  {
    name: "Flight Yoke Keyboard Stand",
    description:
      "Holds a keyboard or tablet comfortably above a flight sim yoke, keeping both within reach mid-flight.",
    tags: ["3D Printing", "Flight Sim"],
    link: { href: "https://ko-fi.com/leafbot/shop", label: "View in shop" },
    featured: true,
  },
];
