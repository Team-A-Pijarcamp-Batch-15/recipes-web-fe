/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import './profile.css'
import axios from 'axios'
import * as Icons from 'react-feather'

import RecipeCardPrivate from '../../Components/RecipeCardPrivate'
import Navbar from '../../Components/Navbar/index'
import Footer from '../../Components/Footer/index'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as myRecipes from '../../slices/recipesPrivate'

function Profile () {
  // const [bookmark, setBookmark] = React.useState(undefined)
  // const [like, setLike] = React.useState(undefined)
  // const [created, setCreated] = React.useState(undefined)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { initialized, created, bookmark, like } = useSelector(state => state.recipesPrivate)

  const { token, user } = useSelector(state => state.auth)

  const createdRecipe = React.useCallback(async () => {
    try {
      if (!initialized.created) {
        const myRecipe = await axios.get(`${window.env.BE_URL}/recipes/getmyrecipe`, {
          headers: {
            Authorization: token
          }
        })

        dispatch(myRecipes.setInit('created'))
        dispatch(myRecipes.setCreated(myRecipe?.data.data))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const myBookmark = React.useCallback(async () => {
    try {
      if (!initialized.bookmark) {
        const bookmarkResponse = await axios.get(`${window.env.BE_URL}/recipes/getmybookmark`, {
          headers: {
            Authorization: token
          }
        })

        dispatch(myRecipes.setInit('bookmark'))
        dispatch(myRecipes.setBookmark(bookmarkResponse?.data?.data))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const myLikes = React.useCallback(async () => {
    try {
      if (!initialized.like) {
        const likedResponse = await axios.get(`${window.env.BE_URL}/recipes/getmylikes`, {
          headers: {
            Authorization: token
          }
        })

        dispatch(myRecipes.setInit('like'))
        dispatch(myRecipes.setLike(likedResponse?.data?.data))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  React.useEffect(() => {
    if (!user && !token) {
      navigate('/')
    }

    createdRecipe()
    myBookmark()
    myLikes()
  }, [])

  const styles = {
    imgProfile: { width: 200, height: 200, objectFit: 'cover', objectPosition: 'center', borderRadius: 100 },
    button: { backgroundColor: 'var(--recipe-color-yellow)', fontWeight: 800, color: 'var(--recipe-color-lavender)' }
  }

  return (
    <>
      <Navbar />

      <div className="d-flex flex-column mb-3 align-items-center mt-5">
        <div>
          <img
            src={user?.photo_profile}
            alt="profile"
            style={styles.imgProfile}
          />
        </div>
        <div className="d-flex flex-column pt-3">
          <h4>
            {
              String(`${user?.first_name} ${user?.last_name}`)
                .split(' ')
                .map(word => word[0].toUpperCase() + word.substring(1))
                .join(' ')
            }
          </h4>
          <button className='btn d-flex gap-2 justify-content-center align-items-center'
            style={styles.button}
            onClick={() => navigate('/form-edit')}>
            <Icons.Settings size={20} />
            Setting
          </button>
        </div>
      </div>

      <div className='container card shadow-sm d-flex flex-column p-5 my-5'>

        <div>
          <h4 style={{ fontWeight: 800 }}>Created Recipes</h4>
        </div>

        <div className={`mt-3 text-center d-flex flex-wrap ${created?.length > 3 ? 'justify-content-around' : ''}`}>
          {
            !created
              ? <p>Sorry you haven't made any recipes yet</p>
              : created?.map((item, index) => (
                <Link key={index} to={`/detail/${String(item.title)
                  .split(' ')
                  .join('-')
                  .toLowerCase()}/${item.recipes_uid}`}>
                  <RecipeCardPrivate image={item.image} title={item.title} key={index}
                    removeHandler={() => { alert('Sorry the feature are coming soon') }} />
                </Link>
              ))
          }
        </div>
      </div>

      <div className='container card shadow-sm d-flex flex-column p-5 my-5'>

        <div>
          <h4 style={{ fontWeight: 800 }}>Saved Recipes</h4>
        </div>

        <div className={'mt-3 text-center d-flex flex-wrap'}>
          {
            !bookmark
              ? <p>Sorry you haven't saved any recipes</p>
              : bookmark?.map((item, index) => (
                <Link key={index} to={`/detail/${String(item.title)
                  .split(' ')
                  .join('-')
                  .toLowerCase()}/${item.recipes_uid}`}>
                  <RecipeCardPrivate image={item.image} title={item.title} key={index}
                    removeHandler={() => { alert('Sorry the feature are coming soon') }} />
                </Link>
              ))
          }
        </div>
      </div>

      <div className='container card shadow-sm d-flex flex-column p-5 my-5'>

        <div>
          <h4 style={{ fontWeight: 800 }}>Like Recipes</h4>
        </div>

        <div className={`mt-3 text-center d-flex flex-wrap ${like?.length > 3 ? 'justify-content-around' : ''}`}>
          {
            !like
              ? <p>Sorry you haven't liked any recipes yet</p>
              : like?.map((item, index) => (
                <Link key={index} to={`/detail/${String(item.title)
                  .split(' ')
                  .join('-')
                  .toLowerCase()}/${item.recipes_uid}`}>
                  <RecipeCardPrivate image={item.image} title={item.title} key={index}
                    removeHandler={() => { alert('Sorry the feature are coming soon') }} />
                </Link>
              ))
          }
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Profile
