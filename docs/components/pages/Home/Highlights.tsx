const highlights = [
  {
    title: "Semantic Commit Messages-based versioning",
    description:
      "TurboVersion supports semantic commit messages-based versioning. It uses commit messages to determine the version of the package. This allows you to automatically generate a new version based on the type of commit message.",
    // img: (
    //   <svg
    //     width="32px"
    //     height="32px"
    //     viewBox="0 0 512 512"
    //     xmlns="http://www.w3.org/2000/svg"
    //   >
    //     <path
    //       fill="#2EC4B6"
    //       d="M256 21.52l-4.5 2.597L52.934 138.76v234.48L256 490.48l203.066-117.24V138.76L256 21.52zm0 20.783l185.066 106.85v213.695L256 469.698 70.934 362.847V149.152L256 42.302zm0 30.93l-4.5 2.597-153.78 88.785v182.77L256 438.768l158.28-91.383v-182.77L256 73.232zm0 20.783l140.28 80.992v161.984L256 417.984l-140.28-80.992V175.008L256 94.016zm0 30.93l-4.5 2.597-108.998 62.93v131.054L256 387.055l113.498-65.528V190.473L256 124.945zm0 20.783l95.498 55.135v110.27L256 366.27l-95.498-55.135v-110.27L256 145.73zm0 30.928l-4.5 2.598-64.213 37.072v79.344L256 335.342l68.713-39.67v-79.344L256 176.658zm0 20.783l50.713 29.28v58.56L256 314.56l-50.713-29.28v-58.56L256 197.44zm0 30.93l-4.5 2.6-19.428 11.216v27.628L256 283.63l23.928-13.816v-27.628L256 228.37z"
    //     />
    //   </svg>
    // ),
  },
  {
    title: "Branch-based versioning",
    description:
      "TurboVersion supports branch-based versioning. It uses the branch name to determine the version of the package. This allows you to automatically generate a new version based on the branch name.",
    // img: (
    //   <svg
    //     fill="#2EC4B6"
    //     height="32px"
    //     width="32px"
    //     version="1.1"
    //     id="Filled_Icons"
    //     xmlns="http://www.w3.org/2000/svg"
    //     xmlnsXlink="http://www.w3.org/1999/xlink"
    //     x="0px"
    //     y="0px"
    //     viewBox="0 0 24 24"
    //     enable-background="new 0 0 24 24"
    //     xmlSpace="preserve"
    //   >
    //     <g id="Validation-Filled">
    //       <path
    //         fill="#2EC4B6"
    //         d="M20.32,8.56c-0.51-1.22,0.38-3.41-0.54-4.33c-0.92-0.92-3.11-0.03-4.33-0.54C14.27,3.19,13.36,1,12,1S9.73,3.19,8.56,3.68
    //  C7.33,4.19,5.14,3.3,4.22,4.22C3.3,5.14,4.19,7.33,3.68,8.56C3.19,9.73,1,10.64,1,12s2.19,2.27,2.68,3.44
    //  c0.51,1.22-0.38,3.41,0.54,4.33c0.92,0.92,3.11,0.03,4.33,0.54C9.73,20.81,10.64,23,12,23s2.27-2.19,3.44-2.68
    //  c1.22-0.51,3.41,0.38,4.33-0.54c0.92-0.92,0.03-3.11,0.54-4.33C20.81,14.27,23,13.36,23,12S20.81,9.73,20.32,8.56z M11,16.41
    //  l-3.71-3.71l1.41-1.41L11,13.59l5.29-5.29l1.41,1.41L11,16.41z"
    //       />
    //     </g>
    //   </svg>
    // ),
  },
  {
    title: "Support for monorepos or single package repositories",
    description:
      "TurboVersion supports monorepos or single package repositories. It allows you to manage versions for multiple packages in a monorepo or a single package repository.",
    // img: (
    //   <svg
    //     fill="#2EC4B6"
    //     height="32px"
    //     width="32px"
    //     version="1.1"
    //     id="Filled_Icons"
    //     xmlns="http://www.w3.org/2000/svg"
    //     xmlnsXlink="http://www.w3.org/1999/xlink"
    //     x="0px"
    //     y="0px"
    //     viewBox="0 0 24 24"
    //     enable-background="new 0 0 24 24"
    //     xmlSpace="preserve"
    //   >
    //     <g id="Validation-Filled">
    //       <path
    //         fill="#2EC4B6"
    //         d="M20.32,8.56c-0.51-1.22,0.38-3.41-0.54-4.33c-0.92-0.92-3.11-0.03-4.33-0.54C14.27,3.19,13.36,1,12,1S9.73,3.19,8.56,3.68
    //  C7.33,4.19,5.14,3.3,4.22,4.22C3.3,5.14,4.19,7.33,3.68,8.56C3.19,9.73,1,10.64,1,12s2.19,2.27,2.68,3.44
    //  c0.51,1.22-0.38,3.41,0.54,4.33c0.92,0.92,3.11,0.03,4.33,0.54C9.73,20.81,10.64,23,12,23s2.27-2.19,3.44-2.68
    //  c1.22-0.51,3.41,0.38,4.33-0.54c0.92-0.92,0.03-3.11,0.54-4.33C20.81,14.27,23,13.36,23,12S20.81,9.73,20.32,8.56z M11,16.41
    //  l-3.71-3.71l1.41-1.41L11,13.59l5.29-5.29l1.41,1.41L11,16.41z"
    //       />
    //     </g>
    //   </svg>
    // ),
  },

];

export default function Highlights() {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight  sm:text-4xl">
          TurboVersion highlights
        </h2>
      </div>

      <div className="flex container justify-center flex-wrap gap-y-2 gap-x-2 mt-16">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="px-3 lg:px-3 py-3 justify-center flex"
          >
            <div className="max-w-sm p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700">
              {/* {item.img} */}
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {item.title}
              </h5>
              <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
