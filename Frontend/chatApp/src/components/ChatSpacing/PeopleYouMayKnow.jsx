import React from 'react'

function PeopleYouMayKnow({propClass}) {
    const data =[ '','','','',''];
  return (
    <ul className={`text-sky-200    px-2 py-2   overflow-y-scroll   scrollbar-custom scroll-smooth gap-2 ${propClass}` }>
           
      {data &&
        data.map((element, index) => (
          <li
            key={index}
            className=" py-1 px-2 sm:max-h-14 flex justify-start gap-6 items-center  my-2 cursor-pointer bg-slate-900  hover:bg-blue-300 hover:border-blue-500 border-slate-100 rounded-lg hover:shadow-md"
            onClick={()=>{
              handleCreateChat(element);
            }}
          >
            <div className=" px-4 py-2">
              <img
                className="sm:h-12 sm:w-12 rounded-full"
                src={element.profilePicture}
                alt="no pic"
              />
            </div>
            <div className="flex flex-col item-center justify-center">
              <p className="  font-sans  font-semibold text-l text-pretty text-blue-500">{element.fullName}</p>

              <p className="text-gray-700 text-sm font-serif  "> {element.userName}</p>
            </div>
          </li>
        ))}
    </ul>
  )
}

export default PeopleYouMayKnow
