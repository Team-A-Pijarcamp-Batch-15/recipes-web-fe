/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import './profile.css'
import axios from 'axios'
import * as Icons from 'react-feather'

import RecipeCardPrivate from '../../Components/RecipeCardPrivate'
import Navbar from '../../Components/Navbar/index'
import Footer from '../../Components/Footer/index'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as myRecipes from '../../slices/recipesPrivate'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Profile () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)

  const { initialized, created, bookmark, like } = useSelector(state => state.recipesPrivate)
  const { token, user } = useSelector(state => state.auth)

  const handleRemoveCreated = React.useCallback(async (uid) => {
    try {
      await axios({
        method: 'delete',
        url: `${window.env.BE_URL}/recipes/delete`,
        data: {
          recipes_uid: uid
        },
        headers: {
          Authorization: token
        }
      })

      const index = created?.findIndex(recipe => recipe.recipes_uid === uid)
      const newCreated = [...created]
      newCreated.splice(index, 1)

      dispatch(myRecipes.setCreated(newCreated))

      MySwal.fire({
        titleText: 'Recipe Removed',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    } catch (error) {
      MySwal.fire({
        titleText: 'Remove Failed',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
  }, [created])

  const handleRemoveBookmark = React.useCallback(async (uid) => {
    try {
      await axios({
        method: 'delete',
        url: `${window.env.BE_URL}/recipes/unbookmark`,
        data: {
          recipes_uid: uid
        },
        headers: {
          Authorization: token
        }
      })

      const index = bookmark?.findIndex(recipe => recipe.recipes_uid === uid)
      const newBookmark = [...bookmark]
      newBookmark.splice(index, 1)

      dispatch(myRecipes.setBookmark(newBookmark))

      MySwal.fire({
        titleText: 'Recipe Unsaved',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    } catch (error) {
      MySwal.fire({
        titleText: 'Unsave Recipe Failed',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
  }, [bookmark])

  const handleRemoveLike = React.useCallback(async (uid) => {
    try {
      await axios({
        method: 'delete',
        url: `${window.env.BE_URL}/recipes/dislike`,
        data: {
          recipes_uid: uid
        },
        headers: {
          Authorization: token
        }
      })

      const index = like?.findIndex(recipe => recipe.recipes_uid === uid)
      const newLike = [...like]
      newLike.splice(index, 1)

      dispatch(myRecipes.setLike(newLike))

      MySwal.fire({
        titleText: 'Recipe Disliked',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    } catch (error) {
      MySwal.fire({
        titleText: 'Recipe Disliked Failed',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
  }, [like])

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
            !created | created?.length === 0
              ? <p>Sorry you haven't made any recipes yet</p>
              : created?.map((item, index) => (
                <RecipeCardPrivate key={index} image={item.image} title={item.title}
                  removeHandler={() => { handleRemoveCreated(item.recipes_uid) }} to={`/detail/${String(item.title)
                    .split(' ')
                    .join('-')
                    .toLowerCase()}/${item.recipes_uid}`} />
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
            !bookmark || bookmark?.length === 0
              ? <p>Sorry you haven't saved any recipes</p>
              : bookmark?.map((item, index) => (
                <RecipeCardPrivate key={index} image={item.image} title={item.title}
                  removeHandler={() => { handleRemoveBookmark(item.recipes_uid) }} to={`/detail/${String(item.title)
                    .split(' ')
                    .join('-')
                    .toLowerCase()}/${item.recipes_uid}`} />
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
            !like || like?.length === 0
              ? <p>Sorry you haven't liked any recipes yet</p>
              : like?.map((item, index) => (
                <RecipeCardPrivate key={index} image={item.image} title={item.title}
                  removeHandler={() => { handleRemoveLike(item.recipes_uid) }} to={`/detail/${String(item.title)
                    .split(' ')
                    .join('-')
                    .toLowerCase()}/${item.recipes_uid}`} />
              ))
          }
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Profile
