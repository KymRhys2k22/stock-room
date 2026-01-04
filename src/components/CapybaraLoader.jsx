/**
 * CapybaraLoader Component
 *
 * A custom CSS-driven animation of a walking capybara.
 * Used as the main loading spinner for the application.
 */
export default function CapybaraLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 pb-24">
      <div
        className="relative z-10 scale-75 w-[14em] h-[10em]"
        style={{
          "--color": "rgb(204,125,45)",
          "--color2": "rgb(83,56,28)",
        }}>
        {/* Capybara */}
        <div className="relative w-full h-[7.5em]">
          {/* Head */}
          <div className="absolute bottom-0 right-0 z-30 w-[7.5em] h-[7em] rounded-[3.5em] bg-[var(--color)] shadow-[-1em_0_var(--color2)] animate-movebody">
            {/* Ears */}
            <div className="absolute top-0 left-0 w-[2em] h-[2em] rounded-full bg-gradient-to-tr from-[var(--color)] to-[var(--color2)] overflow-hidden">
              <div className="absolute bottom-0 left-[0.5em] w-full h-[1em] bg-[var(--color2)] rounded-full -rotate-45" />
            </div>

            <div className="absolute top-0 left-[5em] w-[2em] h-[2em] rounded-full bg-gradient-to-tr from-[var(--color)] to-[var(--color2)]" />

            {/* Mouth */}
            <div className="absolute bottom-0 left-[2.5em] w-[3.5em] h-[2em] rounded-full bg-[var(--color2)] flex items-center justify-around p-[0.5em]">
              <div className="w-[0.25em] h-[0.75em] bg-[var(--color)] rounded-full -rotate-45" />
              <div className="w-[0.25em] h-[0.75em] bg-[var(--color)] rounded-full rotate-45" />
            </div>

            {/* Eyes */}
            <div className="absolute bottom-[3.5em] left-[1.5em] w-[2em] h-[0.5em] bg-[var(--color2)] rounded-full rotate-45" />
            <div className="absolute bottom-[3.5em] left-[5.5em] w-[1.75em] h-[0.5em] bg-[var(--color2)] rounded-full -rotate-45" />
          </div>

          {/* Legs */}
          <div className="absolute bottom-0 left-0 z-20 w-[6em] h-[5em] rounded-[2em] bg-gradient-to-b from-[var(--color)] to-[var(--color2)] animate-movebody" />

          <div className="absolute bottom-0 left-[3.25em] z-20 w-[1.75em] h-[3em] rounded-[0.75em] bg-gradient-to-b from-[var(--color)] to-[var(--color2)] shadow-inner animate-moveleg" />

          <div className="absolute bottom-0 left-[0.5em] z-20 w-[1.25em] h-[2em] rounded-[0.75em] bg-gradient-to-b from-[var(--color)] to-[var(--color2)] animate-moveleg2" />

          {/* Body */}
          <div className="relative z-10 w-[85%] h-full rounded-[45%] bg-gradient-to-b from-[var(--color)] to-[var(--color2)] animate-movebody" />
        </div>

        {/* Loader line */}
        <div className="relative w-full h-[2.5em] overflow-hidden">
          <div className="w-[50em] h-[0.5em] border-t-[0.5em] border-dashed border-[var(--color2)] animate-moveline" />
        </div>
      </div>
    </div>
  );
}
