// Hooks
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem,MenuItems} from "@headlessui/react";

function Categories() {
    // set States
    const [categories, setCategories] = useState([]);

    // Set effect for categories fetching
    useEffect(()=> {
        // FINISH HHIS FUNCTION
        async function fethcCategories() {
            try {
                const response = await fetch(`/api/categories`, {
                    credentials: "include",
                });

            } catch {

            }
        }

    }, [])

    return (
        <Menu as="div" className="relative ml-3">
            <MenuButton className="relative flex rounded-full 
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
              px-4 py-2 hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <span>See Categories!</span>
            </MenuButton>
            <MenuItems transition
                className="absolute right-0 z-10 mt-2 w-48 
                origin-top-right rounded-md bg-[#E0F2FE] py-1 outline -outline-offset-1 outline-white/10 
                transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 
                data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                {categories.map((c, index)=> (
                    <MenuItem key={index} className="block px-4 py-2 text-sm 
                    text-black data-focus:bg-white/5 data-focus:outline-hidden
                    px-4 py-2 hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md">
                        <h1>{c.c}</h1>
                    </MenuItem>
                    ))
                }
            </MenuItems>
        </Menu>

    );
}

export default Categories;
