import { redirect } from "@sveltejs/kit";
import { d as db, f as frameworks } from "../../../chunks/index2.js";
const load = async ({ locals }) => {
  if (!locals.session) redirect(302, "/login");
  if (locals.organization?.onboardingComplete) redirect(302, "/dashboard");
  const allFrameworks = await db.select({
    id: frameworks.id,
    slug: frameworks.slug,
    name: frameworks.name,
    description: frameworks.description,
    recommended: frameworks.recommended
  }).from(frameworks);
  return { frameworks: allFrameworks };
};
export {
  load
};
