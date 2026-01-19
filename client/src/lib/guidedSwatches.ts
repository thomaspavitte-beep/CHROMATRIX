export interface SwatchStep {
  level: number;
  role: string;
  lightnessRange: string;
  description: string;
  swatches: string[];
}

export const GUIDED_STEPS: SwatchStep[] = [
  {
    level: 1,
    role: "Deep Base",
    lightnessRange: "10-15%",
    description: "Start with your darkest tone. This creates depth and anchors your design.",
    swatches: [
      "#0D1B2A", "#1A1A1D", "#1B1B1B", "#0B090A", "#2D1E2F",
      "#1B263B", "#242423", "#101419"
    ]
  },
  {
    level: 2,
    role: "Shadow",
    lightnessRange: "25-35%",
    description: "Add shadow depth. This color creates dimension between your darkest and mid-tones.",
    swatches: [
      "#3E5C76", "#4A4E69", "#540B0E", "#335C67", "#582F0E",
      "#415A77", "#432818", "#386641"
    ]
  },
  {
    level: 3,
    role: "Mid-Tone",
    lightnessRange: "45-55%",
    description: "Your mid-tone bridges dark and light. It's often the most prominent color.",
    swatches: [
      "#778DA9", "#9A8C98", "#9E2A2B", "#E09F3E", "#7F5539",
      "#6A994E", "#5E60CE", "#BC4749"
    ]
  },
  {
    level: 4,
    role: "Light Mid",
    lightnessRange: "60-70%",
    description: "A lighter accent that adds variety without being too bright.",
    swatches: [
      "#A2D2FF", "#C9ADA7", "#E07A5F", "#F4A261", "#B79492",
      "#A7C957", "#90E0EF", "#FFB703"
    ]
  },
  {
    level: 5,
    role: "Soft Tint",
    lightnessRange: "75-85%",
    description: "Soft, light tones that provide breathing room in your palette.",
    swatches: [
      "#BDE0FE", "#F2E9E4", "#F2CC8F", "#E9C46A", "#DDBB99",
      "#DDE5B6", "#CAF0F8", "#FFD60A"
    ]
  },
  {
    level: 6,
    role: "Highlight",
    lightnessRange: "90-95%",
    description: "Your lightest tone. Use for highlights and areas that need to pop.",
    swatches: [
      "#EDF6FF", "#F8F9FA", "#FEFAE0", "#FFF3B0", "#FAF9F6",
      "#F1F8E9", "#E0F7FA", "#FFFDE7"
    ]
  }
];
