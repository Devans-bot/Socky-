"use client";
import { Menu, X, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "../../sanity/client";
import { GET_ALL_CATEGORY } from "../../sanity/queries/categoriesQueries";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function MenuBar() {
  const { isLoaded, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (showCategories && categories.length === 0) {
      client.fetch(GET_ALL_CATEGORY).then((data) => {
        setCategories(data);
      }).catch(console.error);
    }
  }, [showCategories, categories.length]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 hover:bg-neutral-100 rounded-xl transition-colors"
      >
        <Menu size={24} strokeWidth={3} className="text-black" />
      </button>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-full md:w-[30%] h-full z-[100] bg-[#fbfbf2] md:border-r-4 border-black flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.8,0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="p-2 sm:p-6 border-b-4 border-black flex items-center justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 border-4 border-black rounded-xl bg-[#fbfbf2] shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all hover:bg-[#fadadd]"
          >
            <X size={15} strokeWidth={3} className="text-black" />
          </button>
        </div>

        {/* Top Content */}
        <div className="flex-1 mt-5 overflow-y-auto p-2 sm:p-8 flex flex-col gap-4">
          <Link
            href="/socks"
            onClick={() => setIsOpen(false)}
            className="text-sm font-black p-2 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] hover:-translate-y-1 hover:shadow-[2px_4px_0px_#000] transition-all uppercase tracking-wide flex justify-between items-center"
          >
            Shop All
            <span className="text-lg">→</span>
          </Link>

          <div className="flex flex-col border-2 border-black rounded-2xl overflow-hidden shadow-[2px_2px_0px_#000] bg-[#fbfbf2]">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex flex-1 items-center justify-between p-2 text-sm font-black bg-[#fbfbf2] hover:bg-neutral-100 transition-colors uppercase tracking-wide w-full border-b-2 border-black text-left"
            >
              <span>Categories</span>
              <div className={`p-1 border-2 border-black rounded-lg transition-transform duration-300 ${showCategories ? 'bg-black text-white' : 'bg-transparent text-black'}`}>
                {showCategories ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
              </div>
            </button>

            {showCategories && (
              <div className="flex flex-col bg-neutral-100 p-2 gap-2 border-b-4 border-black last:border-b-0 animate-in slide-in-from-top-2 max-h-[30vh] overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-black font-black uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                    <span>Loading...</span>
                    <span className="text-lg animate-spin">🧦</span>
                  </div>
                ) : (
                  categories.map(cat => (
                    <Link
                      key={cat._id}
                      href={`/socks?category=${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-2 text-xs hover:bg-black hover:text-white rounded-xl transition-all border-2 border-transparent hover:border-black uppercase flex items-center justify-between group"
                    >
                      {cat.name}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="p-2 sm:p-8 border-t-3 border-black bg-neutral-100 mt-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-1 border-2 border-black rounded-full bg-[#fadadd] shadow-[2px_2px_0px_#000]">
              <User size={15} strokeWidth={3} className="text-black" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider text-black  drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">Account</span>
          </div>

          <hr className="border-t-2 border-black border-dashed opacity-30 mb-3" />

          {!isLoaded ? (
            <div className="animate-pulse h-10 bg-neutral-200 rounded-xl" />
          ) : !isSignedIn ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <SignInButton mode="modal">
                <button className="flex-1 p-2 text-sm font-black text-center border-2 border-black rounded-2xl bg-[#fbfbf2] shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:-translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all uppercase tracking-wide">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 p-2 text-sm font-black text-center border-2 border-black text-white rounded-2xl bg-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:-translate-y-1 hover:bg-neutral-800 transition-all uppercase tracking-wide">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-2 border-2 border-black rounded-2xl bg-white shadow-[4px_4px_0px_#000]">
                <span className="font-bold uppercase text-xs">Profile</span>
                <UserButton afterSignOutUrl="/" />
              </div>
              <Link href="/orders" className="p-2 text-sm font-black uppercase tracking-wide border-2 border-black rounded-2xl bg-[#fbfbf2] shadow-[2px_2px_0px_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all" onClick={() => setIsOpen(false)}>My Orders</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
