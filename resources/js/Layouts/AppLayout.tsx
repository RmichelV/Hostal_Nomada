import { router } from '@inertiajs/core';
import { Link, Head, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import React, { PropsWithChildren, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ApplicationMark from '@/Components/ApplicationMark';
import Banner from '@/Components/Banner';
import Dropdown from '@/Components/Dropdown';
import DropdownLink from '@/Components/DropdownLink';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Sidebar from './Sidebar';
import { Inertia } from '@inertiajs/inertia';

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

export default function AppLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const { props } = usePage();
  const { auth }: any = props;
  const page = useTypedPage();
  const route = useRoute();
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  function switchToTeam(e: React.FormEvent, team: any) {
    e.preventDefault();
    router.put(
      route('current-team.update'),
      { team_id: team.id },
      { preserveState: false },
    );
  }

  function logout(e: React.FormEvent) {
    e.preventDefault();
    router.post(route('logout'));
  }
  const handleLogout = () => {
    Inertia.post("/logout", {}, {
        onSuccess: () => {
            localStorage.removeItem("authToken");
            Inertia.visit("/login");
        }
    });
};

if (!auth.user) {
    Inertia.visit("/login");
    return null;
}

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head title={title} />
      <Banner />

      {/* Sidebar */}
      {/* <div className="fixed top-0 left-0 bottom-0 w-64 bg-gray-800 text-white pt-16 z-30"> */}

      <div className="top-0 left-0  bottom-0 pt-16">
      {auth.user.rol_id === 1 && <Sidebar head={renderHeader?.()} />}
      </div>

      <div className="flex flex-col flex-1 ">
        
        <nav className="bg-[#027d8c] fixed top-0 left-0 right-0 z-10 border-b border-[#35818b] dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href={route('dashboard')}>
                    <ApplicationMark className="block h-9 w-auto" />
                  </Link>
                </div>
                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                  <NavLink
                    href={route('dashboard')}
                    active={route().current('dashboard')}
                  >
                    Dashboard
                  </NavLink>
                </div>
                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex items">
                            <NavLink href={route("reservation")} active={route().current("reservation")}>
                                Reservaciones
                            </NavLink>
                        </div>
                        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex items">
                            <NavLink href={route("restaurant")} active={route().current("restaurant")}>
                                Restaurante
                            </NavLink>
                        </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <Dropdown
                  align="right"
                  width="48"
                  renderTrigger={() => (
                    <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={page.props.auth.user?.profile_photo_url}
                        alt={page.props.auth.user?.name}
                      />
                    </button>
                  )}
                >
                  <DropdownLink href={route('profile.show')}>Profile</DropdownLink>
                  <form onSubmit={logout}>
                    <DropdownLink as="button">Log Out</DropdownLink>
                  </form>
                </Dropdown>
              </div>

                        {/* <!-- Hamburger --> */}
                        <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() =>
                    setShowingNavigationDropdown(!showingNavigationDropdown)
                  }
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                >
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={classNames({
                        hidden: showingNavigationDropdown,
                        'inline-flex': !showingNavigationDropdown,
                      })}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                    <path
                      className={classNames({
                        hidden: !showingNavigationDropdown,
                        'inline-flex': showingNavigationDropdown,
                      })}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
           {/* <!-- Responsive Navigation Menu --> */}
          <div
            className={classNames('sm:hidden', {
              block: showingNavigationDropdown,
              hidden: !showingNavigationDropdown,
            })}
          >
            <div className="pt-2 pb-3 space-y-1">
              <ResponsiveNavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
              >
                Dashboard
              </ResponsiveNavLink>
            </div>

            {/* <!-- Responsive Settings Options --> */}
            <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center px-4">
                {page.props.jetstream.managesProfilePhotos ? (
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={page.props.auth.user?.profile_photo_url}
                      alt={page.props.auth.user?.name}
                    />
                  </div>
                ) : null}

                <div>
                  <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                    {page.props.auth.user?.name}
                  </div>
                  <div className="font-medium text-sm text-gray-500">
                    {page.props.auth.user?.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <ResponsiveNavLink
                  href={route('profile.show')}
                  active={route().current('profile.show')}
                >
                  Profile
                </ResponsiveNavLink>

                {page.props.jetstream.hasApiFeatures ? (
                  <ResponsiveNavLink
                    href={route('api-tokens.index')}
                    active={route().current('api-tokens.index')}
                  >
                    API Tokens
                  </ResponsiveNavLink>
                ) : null}

                {/* <!-- Authentication --> */}
                <form method="POST" onSubmit={logout}>
                  <ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
                </form>

              </div>
            </div>
          </div>
        </nav>
        <div className="flex-1 pt-16">

        {renderHeader && (
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {renderHeader()}
            </div>
          </header>
        )}

        <main className="p-6 bg-gray-100 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </div>
  );
}
