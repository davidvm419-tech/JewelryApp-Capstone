/* Tailwind navbar component:
https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/navbars
*/
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

//Hooks
import { useNavigate } from 'react-router-dom';



// Components
import Categories from '../products/categories'
import ProfileBox from '../user/profileBox';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function Navbar({ isAuthenticated, userId, username,  wishlist, shoppingCart, orders, logoutSuccess }) {
  
  const navigate = useNavigate();

  return (

    <Disclosure
          as="nav"
          className="relative bg-[#2F6FA3] 
          after:pointer-events-none after:absolute 
          after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center 
                justify-center rounded-md p-2 text-gray-400 
                hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-start pl-10
              sm:items-stretch sm:justify-start sm:pl-0">
                <div className="mr-auto max-w-7xl px-2 sm:px-6 lg:px-8 
                text-black font-light tracking-[0.3em] 
                text-lg uppercase cursor-pointer" onClick={() => navigate('/')}>
                  Geraldine Jewels
                </div>
                <div className="hidden sm:ml-6 sm:block items-right">
                  <div className="flex items-center gap-4">
                    <Categories />
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 pl-8 pt-2 pb-3 flex flex-col items-start
              flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <ProfileBox 
                  isAuthenticated={isAuthenticated} userId={userId} username={username} 
                  wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
                  logoutSuccess={logoutSuccess} />
              </div>
            </div>
          </div>
          {/* Panel for responsive design*/}
          <DisclosurePanel className="sm:hidden">
            <div className="pl-8 pt-2 pb-3 flex flex-col items-start">
                <Categories />
            </div>
          </DisclosurePanel>
    </Disclosure>
  )
}

export default Navbar;
