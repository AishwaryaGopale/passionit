import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from './logo.png';
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const AdminCommon = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [transactionDropdown, setTransactionDropdown] = useState(false);
  const navigate = useNavigate();

  const handleDropdownClick = () => {
    setTransactionDropdown(!transactionDropdown); // Toggle dropdown
    if (!transactionDropdown) {
      navigate('/admin/transaction'); // Navigate to TransactionTable if dropdown is opened
    }
  };

  const closeDropdown = () => {
    setTransactionDropdown(false); // Close dropdown
  };

  return (
    <>
    <div className="sticky top-0 bg-[#FFFFFF]">
      <nav>
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between mx-auto w-5/5">
            <div className="flex items-center justify-between my-2 lg:justify-end lg:gap-[100px]">
              <Link to="">
                <img src={logo} alt="logo" className="h-[40px] w-[100px]" />
              </Link>
              <div className="hidden gap-10 lg:flex">
                <Link to="" className="text-sm">Members</Link>
                <Link to="studenttable" className="text-sm">Ideation</Link>
                <Link to="resarchtable" className="text-sm">Research</Link>
                <Link to="membership" className="text-sm">Membership</Link>
                <Link to="intoppo" className="text-sm">Expression of Interest</Link>
                <Link to="oppo" className="text-sm">Opportunity</Link>
                <Link to="allo" className="text-sm">Allocation</Link>
                <Link to="inter" className="text-sm">Interview</Link>
                <Link to="groupmergertable" className="text-sm">GroupMerge</Link>
                  {/* Transaction button with dropdown */}
                  <div className="relative">
                    <button
                      onClick={handleDropdownClick}
                      className="text-sm flex items-center"
                    >
                      Transaction
                      <ChevronDownIcon className="h-4 w-4 ml-1" /> {/* Dropdown Arrow */}
                    </button>

                    {transactionDropdown && (
                      <div className="absolute mt-2 bg-white border border-gray-200 rounded shadow-lg">
                        <Link
                          to="transactionmaster"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={closeDropdown}
                        >
                          Transaction Type Master
                        </Link>
                        <Link
                          to="Stockexchange"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={closeDropdown}
                        >
                          Stock Exchange
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link to="/" className="text-sm">Log-Out</Link>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center lg:hidden">
                  <button onClick={() => setToggleMenu(!toggleMenu)}>
                    <Bars3Icon className="h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <hr className="border border-[#9b9b9b]" />
      </div>

      <div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminCommon;
