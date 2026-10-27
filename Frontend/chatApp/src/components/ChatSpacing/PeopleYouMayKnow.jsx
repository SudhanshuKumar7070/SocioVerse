import React from 'react'

function PeopleYouMayKnow({ propClass = "" }) {
  const data = [];

  return (
    <ul className={`w-full flex flex-col gap-1.5 overflow-y-auto scrollbar-custom scroll-smooth font-montserrat ${propClass}`}>
      {data && data.length > 0 ? (
        data.map((element, index) => (
          <li
            key={index}
            className="w-full py-2 px-2.5 flex items-center gap-3 cursor-pointer bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-sky-500/40 rounded-xl transition-all duration-200"
          >
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full object-cover border border-slate-700/60"
                src={element.profilePicture || "https://picsum.photos/seed/suggest/100/100"}
                alt="suggested user"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <p className="font-semibold text-sm text-slate-100 truncate">
                {element.fullName}
              </p>
              <p className="text-xs text-sky-400/80 truncate">@{element.userName}</p>
            </div>
          </li>
        ))
      ) : (
        <li className="text-center py-4 text-xs text-slate-500">
          No suggestions available right now
        </li>
      )}
    </ul>
  );
}

export default PeopleYouMayKnow;
