import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { useSelector } from 'react-redux'
import { persistor } from '../../store'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const style = {
  navLeftLink: {
    color: 'var(--recipe-color-lavender)',
    backgroundColor: 'white',
    fontWeight: 600
  }
}

export default function Navbar () {
  const { user, token } = useSelector(state => state.auth)
  const MySwal = withReactContent(Swal)

  React.useEffect(() => {
  }, [])

  return (

    <nav className="container d-flex justify-content-between my-4 align-items-center">
      <div className="nav-left d-flex gap-2 align-items-center">
        {!user && !token
          ? (
            <>
              <Link to="/">
                <div
                  className="nav-container d-flex align-items-center"
                  style={{ height: '64px', borderRadius: '30px' }}
                >
                  <img
                    className="shadow-sm"
                    style={{ height: '64px', borderRadius: '30px' }}
                    src="/logo-h.svg"
                    alt="logo"
                  />
                </div>
              </Link>
              <Link to="/">
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Home
                  </span>
                </div>
              </Link>
              <Link to="/search">
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Search Recipe
                  </span>
                </div>
              </Link>
              <Link to="/user/login" onClick={() => {
                MySwal.fire({
                  titleText: 'Please Login First',
                  timer: 1000,
                  showCancelButton: false,
                  showConfirmButton: false
                })
              }}>
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Add Recipe
                  </span>
                </div>
              </Link>
            </>
          )
          : (
            <>
              <Link to="/">
                <div
                  className="nav-container d-flex align-items-center"
                  style={{ height: '64px', borderRadius: '30px' }}
                >
                  <img
                    className="shadow-sm"
                    style={{ height: '64px', borderRadius: '30px' }}
                    src="/logo-h.svg"
                    alt="logo"
                  />
                </div>
              </Link>
              <Link to="/">
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Home
                  </span>
                </div>
              </Link>
              <Link to="/search">
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Search Recipe
                  </span>
                </div>
              </Link>
              <Link to="/add-recipe">
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Add Recipe
                  </span>
                </div>
              </Link>
              <Link to="/profile">
                <div
                  className="nav-container shadow-sm p-3 desktop-component"
                  style={{ borderRadius: '36px', backgroundColor: 'white' }}
                >
                  <span style={style.navLeftLink} className="nav-left-link">
                    Profile
                  </span>
                </div>
              </Link>
            </>
          )}
      </div>

      <div className="nav-right d-flex">
        {/* Desktop Menu */}
        {!user && !token
          ? (
            <Link to="/user/login">
              <div
                className="nav-container shadow-sm p-2 d-flex align-items-center gap-2 desktop-component"
                style={{ borderRadius: '36px', backgroundColor: 'white' }}
              >
                <span style={style.navLeftLink} className="nav-right-link">
                  Login
                </span>
                <img
                  className="shadow-sm"
                  style={{ height: '48px', borderRadius: '50%' }}
                  src="/profile.svg"
                  alt="logo"
                />
              </div>
            </Link>
          )
          : (
            <div className="btn-group">
              <div
                className="nav-container shadow-sm p-2 d-flex align-items-center gap-2 desktop-component"
                data-bs-toggle="dropdown"
                style={{ borderRadius: '36px', backgroundColor: 'white' }}
              >
                <div>
                  <span style={style.navLeftLink} className="nav-right-link">
                    Hi, {user?.first_name}
                  </span>
                </div>
                <img
                  className="shadow-sm"
                  style={{ width: 48, height: 48, objectFit: 'cover', objectPosition: 'center', borderRadius: '50%' }}
                  src={user?.photo_profile}
                  alt="logo"
                />
              </div>
              <ul className="dropdown-menu dropdown-menu-lg-end desktop-component">
                <li>
                  <button
                    className="dropdown-item shadow-sm text-center"
                    type="button"
                    onClick={() => {
                      persistor.purge()
                      window.location.reload()
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        {/* End Of Desktop Menu */}

        {/* Mobile Nav */}
        {!user && !token
          ? (
            <div className="btn-group">
              <div
                className="nav-container shadow-sm p-2 d-flex align-items-center gap-2 mobile-component"
                data-bs-toggle="dropdown"
                style={{ borderRadius: '36px', backgroundColor: 'white' }}
              >
                <img
                  className="shadow-sm"
                  style={{ height: '48px', borderRadius: '50%' }}
                  src="/profile.svg"
                  alt="logo"
                />
              </div>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li className="">
                  <Link to="/user/login">
                    <button
                      className="dropdown-item shadow text-center my-1 mobile-component"
                      type="button"
                    >
                      Login
                    </button>
                  </Link>
                </li>
                <li className="">
                  <Link to="/user/register">
                    <button
                      className="dropdown-item shadow text-center my-1 mobile-component"
                      type="button"
                    >
                      Register
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          )
          : (
            <div className="btn-group">
              <div
                className="nav-container shadow-sm p-2 d-flex align-items-center gap-2 mobile-component"
                data-bs-toggle="dropdown"
                style={{ borderRadius: '36px', backgroundColor: 'white' }}
              >
                <img
                  className="shadow-sm"
                  style={{ width: 48, height: 48, objectFit: 'cover', objectPosition: 'center', borderRadius: '50%' }}
                  src={user?.photo_profile}
                  alt="logo"
                />
              </div>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li>
                  <Link style={{ textAlign: 'center' }} to="/profile">
                    <button
                      className="dropdown-item shadow text-center my-1 mobile-component"
                      type="button"
                    >
                      <div>Profile</div>
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <button
                      className="dropdown-item shadow text-center my-1 mobile-component"
                      type="button"
                    >
                      Home
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/search">
                    <button
                      className="dropdown-item shadow text-center my-1 mobile-component"
                      type="button"
                    >
                      Search Recipe
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/add-recipe">
                    <button
                      className="dropdown-item shadow text-center my-1 mobile-component"
                      type="button"
                    >
                      Add Recipe
                    </button>
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item shadow text-center my-1 mobile-component"
                    type="button"
                    onClick={() => {
                      persistor.purge()
                      window.location.reload()
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        {/* Mobile Nav */}

      </div>
    </nav>

  )
}
