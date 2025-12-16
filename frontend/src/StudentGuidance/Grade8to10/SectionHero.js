export default function SectionHero() {
  return (
    <section id="home" className="pt-28 pb-32 px-6 bg-gradient-to-br from-blue-50 to-white">

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <span className="bg-blue-200 px-4 py-1 rounded-full text-sm font-semibold">
            For Class 8th–10th Students
          </span>

          <h1 className="text-5xl font-extrabold mt-6 text-blue-900 leading-tight">
            Discover Your Talent & Choose Your Future!
          </h1>

          <p className="text-gray-700 mt-4 text-lg">
            A simple and friendly science-based assessment for students who want career clarity.
          </p>

          <div className="mt-6 flex gap-4">
            <a href="#quiz-section" className="bg-blue-600 text-white px-7 py-3 rounded-xl shadow hover:bg-blue-700">
              Start Career Quiz
            </a>
            <button className="bg-pink-600 text-white px-7 py-3 rounded-xl shadow hover:bg-pink-700">
              Talk to Mentor
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="w-80 h-80 rounded-full overflow-hidden shadow-xl border-[10px] border-white mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1588072432836-e10032774350"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

    </section>
  );
}
