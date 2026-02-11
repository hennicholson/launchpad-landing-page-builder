/**
 * Copy Frameworks - AIDA, PAS, BAB
 *
 * Copywriting frameworks that guide section generation
 * to create compelling, conversion-optimized content.
 */

import type { CopyFramework, CopyFrameworkDefinition, SectionPurpose } from "../types";
import type { SectionType } from "@/lib/page-schema";

/**
 * AIDA Framework Definition
 * Attention → Interest → Desire → Action
 *
 * Best for: SaaS, tech products, B2B
 */
const AIDA: CopyFrameworkDefinition = {
  id: "AIDA",
  name: "Attention, Interest, Desire, Action",
  description:
    "Classic marketing framework that moves visitors through awareness stages. Best for products with clear benefits and established markets.",
  stages: [
    {
      name: "Attention",
      sections: ["hero", "header"],
      copyGuidelines: `
ATTENTION STAGE - Grab attention immediately
Headlines should:
- Lead with the biggest benefit or transformation
- Use power words: Revolutionary, Effortless, Instant, Proven
- Include specific numbers when possible (10x, 3 hours, 47%)
- Create curiosity without being clickbait
- Address the reader directly ("You" language)

Examples:
- "Ship 10x Faster with AI-Powered Code Reviews"
- "The $50,000 Marketing Strategy Now Available for $47"
- "Finally: Email Marketing That Actually Gets Opened"
`,
    },
    {
      name: "Interest",
      sections: ["features", "stats", "process", "logoCloud", "video"],
      copyGuidelines: `
INTEREST STAGE - Build understanding and engagement
Content should:
- Explain HOW the product delivers the promised benefit
- Use concrete examples and specifics
- Show process/methodology (builds confidence)
- Include proof points (stats, logos, metrics)
- Answer "How does this work?"

Headlines for this stage:
- "Here's How It Works"
- "The Simple 3-Step Process"
- "Trusted by 10,000+ Teams Worldwide"
- "Built for [Target Audience]"
`,
    },
    {
      name: "Desire",
      sections: ["testimonials", "comparison", "creator", "founders"],
      copyGuidelines: `
DESIRE STAGE - Create emotional connection and want
Content should:
- Feature real customer success stories
- Show transformation (before/after)
- Build trust through credibility
- Address "people like me" identity
- Make them imagine using the product

Testimonial guidelines:
- Include specific results ("increased by 340%")
- Show diverse customer types
- Include job titles and company names
- Keep quotes conversational and authentic
`,
    },
    {
      name: "Action",
      sections: ["cta", "pricing", "offer"],
      copyGuidelines: `
ACTION STAGE - Drive conversion with clear next steps
Content should:
- Have ONE clear call to action
- Remove friction (free trial, no credit card)
- Add urgency when appropriate
- Include guarantee/risk reversal
- Make the action feel easy

CTA examples:
- "Start Your Free 14-Day Trial"
- "Get Instant Access Now"
- "Join 10,000+ Happy Customers"
- "Try It Free - No Credit Card Required"
`,
    },
  ],
  sectionMapping: {
    navigation: ["header"],
    attention: ["hero"],
    interest: ["features", "stats", "process", "logoCloud", "video"],
    desire: ["testimonials", "comparison", "creator", "founders"],
    action: ["cta", "pricing", "offer"],
    proof: ["logoCloud", "stats", "testimonials"],
    objections: ["faq"],
    footer: ["footer"],
  },
  headlines:
    "Bold, benefit-focused, specific. Use numbers and power words. Create curiosity.",
  subheadlines:
    "Expand on the headline promise. Add context. Keep under 20 words.",
  ctas: "Action verb + outcome. Examples: 'Start Free Trial', 'Get Instant Access', 'Join Now'",
  bodyText:
    "Benefit-first. Short paragraphs. Conversational but professional. Address objections.",
};

/**
 * PAS Framework Definition
 * Problem → Agitate → Solution
 *
 * Best for: E-commerce, agency services, problem-solving products
 */
const PAS: CopyFrameworkDefinition = {
  id: "PAS",
  name: "Problem, Agitate, Solution",
  description:
    "Framework that starts with the customer's pain point, intensifies it, then presents your product as the solution. Best for products solving specific problems.",
  stages: [
    {
      name: "Problem",
      sections: ["hero", "value-proposition"],
      copyGuidelines: `
PROBLEM STAGE - Identify and name the pain
Headlines should:
- Acknowledge the specific problem they face
- Use their exact language/terminology
- Show you understand their situation
- Create "yes, that's me" recognition

Examples:
- "Tired of Losing Customers to Slow Response Times?"
- "Still Manually Processing Invoices in 2024?"
- "Your Website Visitors Are Leaving Without Converting"
- "Marketing Reports Taking 10+ Hours Every Week?"

The reader should think: "This is exactly my problem!"
`,
    },
    {
      name: "Agitate",
      sections: ["stats", "comparison", "features"],
      copyGuidelines: `
AGITATE STAGE - Make the problem feel urgent
Content should:
- Quantify the cost of the problem
- Show what they're missing out on
- Create emotional urgency
- Reference competitors who solved this
- Make inaction feel painful

Stats to use:
- "Companies lose $X annually to [problem]"
- "Your competitors are growing Y% faster"
- "Every day you wait costs you Z customers"

This stage should create urgency without being manipulative.
`,
    },
    {
      name: "Solution",
      sections: ["features", "testimonials", "process", "cta", "pricing"],
      copyGuidelines: `
SOLUTION STAGE - Present your product as the answer
Content should:
- Position your product as the relief
- Show the transformation possible
- Provide proof it works (testimonials, case studies)
- Make getting started easy
- Include clear next steps

Headlines for this stage:
- "There's a Better Way"
- "Introducing [Product]: [Benefit]"
- "Here's How [Product] Solves This"
- "Get [Benefit] Without [Pain Point]"

CTAs should feel like relief from the problem.
`,
    },
  ],
  sectionMapping: {
    navigation: ["header"],
    attention: ["hero"],
    interest: ["stats", "comparison", "features", "process"],
    desire: ["testimonials", "creator"],
    action: ["cta", "pricing", "offer"],
    proof: ["stats", "testimonials"],
    objections: ["faq"],
    footer: ["footer"],
  },
  headlines:
    "Problem-aware. Start with pain. Use 'frustrated', 'tired of', 'still struggling with'.",
  subheadlines: "Intensify the problem or hint at the solution. Build tension.",
  ctas: "Relief-focused. Examples: 'Solve This Now', 'End the Struggle', 'Fix It Today'",
  bodyText:
    "Empathetic. Show you understand. Then pivot to solution. Use before/after contrast.",
};

/**
 * BAB Framework Definition
 * Before → After → Bridge
 *
 * Best for: Courses, coaching, transformation products
 */
const BAB: CopyFrameworkDefinition = {
  id: "BAB",
  name: "Before, After, Bridge",
  description:
    "Storytelling framework showing transformation. Before (current state) → After (dream state) → Bridge (your product). Best for transformation-based products.",
  stages: [
    {
      name: "Before",
      sections: ["hero", "audience"],
      copyGuidelines: `
BEFORE STAGE - Paint the current painful reality
Headlines should:
- Describe their current struggling state
- Create recognition and empathy
- Use "you know the feeling" language
- Be specific about daily frustrations

Examples:
- "You're Working 60-Hour Weeks But Still Falling Behind"
- "Another Month, Another Failed Marketing Campaign"
- "Watching Your Competitors Get All the Clients"
- "Feeling Like an Imposter in Every Client Meeting"

The reader should think: "That's exactly how I feel!"
`,
    },
    {
      name: "After",
      sections: ["features", "stats", "testimonials", "creator"],
      copyGuidelines: `
AFTER STAGE - Show the transformed future
Content should:
- Paint a vivid picture of success
- Use sensory, emotional language
- Show real examples (testimonials)
- Make it feel achievable
- Create desire for this new reality

Headlines for this stage:
- "Imagine Waking Up to [Desired Outcome]"
- "Picture Your Life With [Benefit]"
- "What Would You Do With [Time/Money Saved]?"
- "Join [Number] People Who Transformed Their [Area]"

Testimonials should emphasize transformation, not just satisfaction.
`,
    },
    {
      name: "Bridge",
      sections: ["process", "offer-details", "pricing", "cta"],
      copyGuidelines: `
BRIDGE STAGE - Show the path from Before to After
Content should:
- Present your product as THE bridge
- Show simple, clear steps
- Remove complexity barriers
- Build confidence they can do it
- Make starting feel easy

Headlines for this stage:
- "Here's How to Get There"
- "The [X]-Step Path to [Outcome]"
- "Your Roadmap to [Transformation]"
- "Start Your Journey Today"

Process sections are crucial here - they show HOW the transformation happens.
`,
    },
  ],
  sectionMapping: {
    navigation: ["header"],
    attention: ["hero"],
    interest: ["features", "stats", "process", "offer-details"],
    desire: ["testimonials", "creator", "audience"],
    action: ["cta", "pricing", "offer"],
    proof: ["testimonials", "stats"],
    objections: ["faq"],
    footer: ["footer"],
  },
  headlines:
    "Transformation-focused. Paint current state or dream state. Use contrast.",
  subheadlines: "Bridge the gap. Hint at how the transformation happens.",
  ctas: "Journey-focused. Examples: 'Start My Transformation', 'Begin Your Journey', 'Get Started Today'",
  bodyText:
    "Story-driven. Before/after contrast. Use 'imagine', 'picture', 'what if'. Make transformation feel possible.",
};

/**
 * All framework definitions
 */
export const COPY_FRAMEWORKS: Record<CopyFramework, CopyFrameworkDefinition> = {
  AIDA,
  PAS,
  BAB,
};

/**
 * Get framework based on product type and urgency
 */
export function selectCopyFramework(
  productType: string,
  urgencyLevel: string,
  pricePoint: string
): CopyFramework {
  // High urgency or e-commerce → PAS (problem-focused)
  if (urgencyLevel === "high" || productType === "ecommerce") {
    return "PAS";
  }

  // Courses, coaching → BAB (transformation-focused)
  if (["course", "webinar", "coaching"].includes(productType)) {
    return "BAB";
  }

  // High-ticket items → BAB
  if (["premium", "enterprise"].includes(pricePoint)) {
    return "BAB";
  }

  // Default: AIDA for SaaS, tech, general
  return "AIDA";
}

/**
 * Get copy guidelines for a specific section based on framework
 */
export function getSectionCopyGuidelines(
  framework: CopyFramework,
  sectionType: SectionType,
  purpose: SectionPurpose
): string {
  const def = COPY_FRAMEWORKS[framework];

  // Find which stage this section belongs to
  for (const stage of def.stages) {
    if (stage.sections.includes(sectionType)) {
      return `
## ${framework} Framework - ${stage.name} Stage

${stage.copyGuidelines}

## General Copy Rules for ${sectionType}
Headlines: ${def.headlines}
Subheadlines: ${def.subheadlines}
CTAs: ${def.ctas}
Body text: ${def.bodyText}
`;
    }
  }

  // Default guidelines
  return `
## ${framework} Framework Guidelines

Headlines: ${def.headlines}
Subheadlines: ${def.subheadlines}
CTAs: ${def.ctas}
Body text: ${def.bodyText}
`;
}

/**
 * Get stage-appropriate headlines examples
 */
export function getHeadlineExamples(
  framework: CopyFramework,
  purpose: SectionPurpose,
  keywords: string[]
): string[] {
  const examples: Record<CopyFramework, Record<SectionPurpose, string[]>> = {
    AIDA: {
      attention: [
        `The ${keywords[0] || "Solution"} That's Changing Everything`,
        `Finally: ${keywords[0] || "Results"} Without the Hassle`,
        `10x Your ${keywords[0] || "Output"} in Just 30 Days`,
      ],
      interest: [
        "Here's How It Works",
        "The Simple 3-Step Process",
        "Built for Results",
      ],
      desire: [
        "Join Thousands of Happy Customers",
        "See What Others Are Saying",
        "Real Results from Real People",
      ],
      action: [
        "Start Your Free Trial Today",
        "Get Instant Access Now",
        "Ready to Transform Your Business?",
      ],
      navigation: [],
      proof: ["Trusted by Industry Leaders", "The Numbers Speak"],
      objections: ["Frequently Asked Questions", "Got Questions? We Have Answers"],
      footer: [],
    },
    PAS: {
      attention: [
        `Tired of ${keywords[0] || "Struggling"}?`,
        `Still Dealing With ${keywords[0] || "This Problem"}?`,
        `${keywords[0] || "This Problem"} Costing You Time and Money?`,
      ],
      interest: [
        "The Cost of Doing Nothing",
        "What You're Missing Out On",
        "Why Most Solutions Fail",
      ],
      desire: [
        "There's a Better Way",
        "Finally, a Solution That Works",
        "See How Others Solved This",
      ],
      action: [
        "End the Struggle Now",
        "Solve This Today",
        "Stop Losing Time and Money",
      ],
      navigation: [],
      proof: ["The Numbers Don't Lie", "See the Difference"],
      objections: ["Your Questions, Answered"],
      footer: [],
    },
    BAB: {
      attention: [
        `From ${keywords[0] || "Struggling"} to ${keywords[1] || "Success"}`,
        `Imagine ${keywords[0] || "Achieving Your Goals"}...`,
        `Ready to Transform Your ${keywords[0] || "Results"}?`,
      ],
      interest: [
        "Picture Your Life With...",
        "What Success Looks Like",
        "The Transformation Awaits",
      ],
      desire: [
        "They Did It. So Can You.",
        "Real Transformations, Real People",
        "Your Success Story Starts Here",
      ],
      action: [
        "Start Your Journey Today",
        "Begin Your Transformation",
        "Take the First Step",
      ],
      navigation: [],
      proof: ["Success Stories", "Transformations That Inspire"],
      objections: ["Everything You Need to Know"],
      footer: [],
    },
  };

  return examples[framework]?.[purpose] || [];
}
