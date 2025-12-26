import EnquiryForm from "./EnquiryForm";
function ProfilePage({ profileId }) {
  const profileData = {
    linkedin: {
      title: "LinkedIn Profile Optimization",
      badge: "For recruiters & networking",
      subtext:
        "Position your LinkedIn profile so recruiters can quickly understand your skills, experience, and target roles.",
      benefits: [
        "Clear, role‑focused headline and About section.",
        "Stronger visibility in recruiter searches with the right keywords.",
        "Projects and experience arranged to highlight your most relevant work.",
      ],
      points: [
        "Refine headline and About to match your target roles and tech stack.",
        "Reorder experience, projects, and internships for maximum impact.",
        "Align skills and endorsements with the roles you are aiming for.",
        "Set up a professional, consistent overall profile presentation.",
      ],
    },

    naukri: {
      title: "Naukri.com Profile Enhancement",
      badge: "For Indian job portals",
      subtext:
        "Structure your Naukri profile to appear in the right filters and receive more relevant interview calls.",
      benefits: [
        "Higher ranking in recruiter searches for your preferred roles.",
        "Cleaner alignment between your profile, resume, and preferences.",
        "Reduced spam calls by clarifying role, location, and CTC expectations.",
      ],
      points: [
        "Complete key sections with accurate, up‑to‑date information.",
        "Optimize headline, summary, and key skills with relevant keywords.",
        "Upload an ATS‑friendly resume consistent with your profile.",
        "Fine‑tune job, location, and salary preferences.",
      ],
    },

    resume: {
      title: "Professional Resume Crafting",
      badge: "For strong first impressions",
      subtext:
        "Build a concise, ATS‑friendly resume that highlights your strengths and makes decisions easy for recruiters.",
      benefits: [
        "Clear structure that can be scanned in seconds.",
        "Bullet points focused on outcomes, not just tasks.",
        "Formatting that works across portals and HR systems.",
      ],
      points: [
        "Rewrite content around measurable impact and results.",
        "Use a clean layout with consistent typography and spacing.",
        "Prioritize projects, internships, and achievements that match your goals.",
        "Adapt summary and skills to specific job descriptions.",
      ],
    },

    github: {
      title: "GitHub Profile Showcase",
      badge: "For software & tech roles",
      subtext:
        "Present your GitHub as a curated portfolio that demonstrates your coding quality, consistency, and project depth.",
      benefits: [
        "Pinned repositories that clearly represent your best work.",
        "Well‑documented projects that are easy to review.",
        "Profile that supports internship, open‑source, and remote opportunities.",
      ],
      points: [
        "Select and pin repositories aligned with your target stack.",
        "Add focused README files for key projects.",
        "Organize branches and commits for a professional look.",
        "Update your profile README with a concise overview of your skills.",
      ],
    },

    portfolio: {
      title: "Portfolio Website Development",
      badge: "For showcasing projects",
      subtext:
        "Create a personal website that presents your projects, skills, and story in a clear, modern format.",
      benefits: [
        "Single link that summarises who you are and what you build.",
        "Structured project case studies for technical and non‑technical viewers.",
        "Consistent, easily updatable personal brand.",
      ],
      points: [
        "Design a responsive site that works across devices.",
        "Turn projects into short case studies: context, solution, and results.",
        "Add a focused About section and a simple tech stack overview.",
        "Include clear contact options and calls‑to‑action.",
      ],
    },

    "cover-letter": {
      title: "Winning Cover Letter Writing",
      badge: "For personalised outreach",
      subtext:
        "Craft tailored cover letters that connect your background to the specific role and company.",
      benefits: [
        "Stronger positioning compared to generic templates.",
        "Better narrative for candidates with limited experience.",
        "Professional communication that reflects well on you.",
      ],
      points: [
        "Structure letters with a clear opening, middle, and close.",
        "Connect 2–3 relevant experiences directly to the role.",
        "Use specific examples instead of generic claims.",
        "End with a confident, polite call‑to‑action.",
      ],
    },
  };

  const data = profileData[profileId];

  return (
    <div className="profile-full">
      <div className="profile-full-inner">
        <header className="profile-full-header">
          <span className="profile-full-badge">{data.badge}</span>
          <h1 className="profile-full-title">{data.title}</h1>
          <p className="profile-full-subtext">{data.subtext}</p>
        </header>

        <section className="profile-full-section">
          <h2 className="profile-full-heading">Why this helps you</h2>
          <ul className="profile-full-list">
            {data.benefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="profile-full-section">
          <h2 className="profile-full-heading">What we focus on</h2>
          <ul className="profile-full-list">
            {data.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="profile-full-section profile-full-enquiry">
          <h2 className="profile-full-heading">Request guidance</h2>
          <p className="profile-full-enquiry-text">
            Share your email and, if you like, a short note about your current situation.
          </p>
          <EnquiryForm profileType={profileId} />
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
