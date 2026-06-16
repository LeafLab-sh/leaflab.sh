export type TeamMember = {
  name: string;
  location: string;
  photo: string; // path relative to public/ root, e.g. "/images/team/lea.jpg"
  bioLink: {
    href: string; // full URL
    label: string; // display text, e.g. "LinkedIn", "GitHub", "lea.sh"
  };
};

export const team: TeamMember[] = [
  {
    name: "Lea Fairbanks",
    location: "Midvale, UT",
    photo: "/images/team/9mm.png",
    bioLink: { href: "https://leaflab.sh", label: "My Site" },
  }
];
