import React, { useEffect, useState } from "react";
import User from "./user";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../store2/user/user.thunk";
import { SlArrowLeft } from "react-icons/sl";
const Sidebar = () => {
  const { otheruser, userProfile, selectedUser } = useSelector(state => state.userReducers)
  const [mapSearchUser, setmapSearchUser] = useState([])
  const [searchVal, setSearchVal] = useState("")
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()

  const handleLOGOUT = async () => {
    let res = await dispatch(logoutThunk())
    if (res?.payload) {
      navigate("/login")
    }
  }
  useEffect(() => {
    if (!searchVal) {
      setmapSearchUser(otheruser)
    } else {
      setmapSearchUser(otheruser?.filter(x => {
        return x.username.toLowerCase().includes(searchVal.toLowerCase()) ||
          x.fullName.toLowerCase().includes(searchVal.toLowerCase())
      }
      )
      )
    }
  }, [searchVal])
  return (
    <>
      <div className=" hidden md:flex  flex-col  max-w-[15rem] px-2 border-r-1   border-indigo-500  divide-double divide-navy-900 gap-1 h-screen ">
        <h1 className="text-center ">☕CoffeeMe</h1>
        <hr />
        <div>
          <label className="input ">
            <input type="search" className="grow" placeholder="Search" onChange={(e => setSearchVal(() => e.target.value))} />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>
        <div className=" px-2 h-full overflow-y-auto" >
          {mapSearchUser?.map(e => {
            return (
              <User otheruser={e} key={e._id} setOpen={setOpen} />
            )
          })}
        </div>
        <hr />
        <div className="flex mb-0">
          <div className="avatar w-full gap-3 py-2 ">
            <div className="ringbase-100 w-[2rem] rounded-full ring-2 ">
              <img src={userProfile?.avatar || "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"} alt='userprofile'
              />
            </div>
            <h1 className="line-clamp-1 capitalize">{userProfile?.username} </h1>
          </div>
          <button onClick={() => { handleLOGOUT() }} className="btn btn-md btn-none text-xs hover:border-cyan-900">Logout</button>
        </div>
      </div >
      {/* mobile */}
      <div className="fixed top-0 left-0 z-50 md:hidden">
        <button onClick={() => setOpen(!open)}
          className=" top-2 left-0 fixed  btn btn-circle btn-sm  font-bold text-white"
        >
          <SlArrowLeft />
        </button>
      </div >
      {open && (
        <div className="fixed inset-0 bg-black /40 z-40 flex justify-start md:hidden cursor-pointer">
          <div className="flex flex-col bg-base-100 w-60 h-full p-4 shadow-xl relative">
            <div className="p-4 md:hidden w-full my-5">
              <label className="input w-full flex items-center gap-2">
                <input
                  type="search"
                  className="flex-1 px-1 py-1 text-sm md:text-base rounded-md "
                  placeholder="Search"
                />
                <kbd className="kbd kbd-xs md:kbd-sm">⌘</kbd>
                <kbd className="kbd kbd-xs md:kbd-sm">K</kbd>
              </label>
            </div>
            <h2 className="text-lg font-bold mb-0">Chats</h2>
            <hr />
            <hr />
            <div className="flex flex-col gap-4 overflow-y-auto h-full cursor-pointer " >
              {otheruser?.map(e => {
                return (
                  <User otheruser={e} key={e._id} setOpen={setOpen} />
                )
              })}
            </div>
            <hr />
            <div className="flex items-center justify-between p-2 bg-base-200 shadow-md md:hidden sticky bottom-0  w-full z-50">
              {/* Avatar + username */}
              <div className="flex items-center gap-3">
                <div className="avatar w-5 h-5">
                  <div className="w-full h-full rounded-full ring-2 ring-indigo-200 overflow-hidden">
                    <img src={userProfile?.avatar || "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"} alt='userprofile'
                    />
                  </div>
                </div>
                <h1 className="line-clamp-1 text-sm font-medium capitalize">{userProfile?.username}</h1>
              </div>

              {/* Logout button */}
              <button
                onClick={() => handleLOGOUT()}
                className="btn btn-sm btn-outline text-xs px-2 py-1"
              >
                Logout
              </button>
            </div>
          </div>


        </div>
      )
      }
    </>

  )
}

export default Sidebar
