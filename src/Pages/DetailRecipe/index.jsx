/* eslint-disable multiline-ternary */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable camelcase */
import axios from 'axios'
import React from 'react'
import YouTube from 'react-youtube'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import { useParams } from 'react-router-dom'
import Loading from '../../Components/Loading'
import Error404 from '../../Components/Error404'
import './detailRecipe.css'
import { useSelector, useDispatch } from 'react-redux'
import * as myRecipes from '../../slices/recipesPrivate'
import * as Icons from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const style = {
  h1: {
    color: 'var(--recipe-color-lavender)',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: 600
  },
  comentBtn: {
    width: '180px',
    height: '53px',
    fontWeight: 600,
    color: 'var(--recipe-color-lavender)',
    backgroundColor: '#efc81a',
    textAlign: 'center',
    borderRadius: '36px'
  }
}

export default function DetailRecipe () {
  const [foodDetail, setFoodDetail] = React.useState(undefined)
  const [ingredients, setIngredient] = React.useState([])
  const [steps, setSteps] = React.useState([])
  // const [utils, setUtils] = React.useState([])
  // const [advice, setAdvice] = React.useState([])
  const [comments, setComments] = React.useState([])
  const [loading, setLoading] = React.useState(undefined)
  const [recipesUid, setRecipesUid] = React.useState([])
  const [userComment, setUserComment] = React.useState('')
  const [mesgError, setMesgerror] = React.useState(null)
  const [sucesNotif] = React.useState(null)
  const { recipes_uid, new_added } = useParams()
  const { token, user } = useSelector(state => state.auth)
  const { created, bookmark, like } = useSelector(state => state.recipesPrivate)
  const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)

  const initpage = async () => {
    try {
      setLoading(true)

      if (!foodDetail) {
        const food = await axios({
          method: 'get',
          url: `${String(window.env.BE_URL)}/recipes/${recipes_uid}`
        })

        setFoodDetail(food?.data?.data[0])
        setRecipesUid(food.data?.data[0]?.recipes_uid)
        setIngredient(food?.data?.data[0]?.ingredients?.ingridient)
        setSteps(food?.data?.data[0]?.ingredients?.steps)

        if (created && new_added === 'new') {
          const isContain = created?.findIndex(recipe => recipe.recipes_uid === food?.data?.data[0].recipes_uid)
          const isMyRecipe = food?.data?.data[0]?.created_by === user.user_uid

          if (isMyRecipe && created && isContain === -1) {
            dispatch(myRecipes.setCreated([...created, food?.data?.data[0]]))
          }
        }

        const comment = await axios({
          method: 'get',
          url: `${window.env.BE_URL}/recipes/${recipes_uid}/detail/comments`
        })
        // console.log(comment)
        setComments(comment.data.data)
        // console.log(food)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const commentHandler = async (req, res) => {
    try {
      await axios({
        method: 'post',
        url: `${String(window.env.BE_URL)}/comments`,
        data: {
          recipeUid: recipesUid,
          message: userComment
        },
        headers: {
          Authorization: token
        }
      })

      window.location.reload()
    } catch (error) {
      if (error?.message === 'Request failed with status code 422') {
        setMesgerror(error?.response?.data?.message)
      } else if (error?.message === 'Request failed with status code 401') {
        setMesgerror('Please Login First')
      }
      console.log(error)
    }
  }

  React.useEffect(() => {
    initpage()
    if (!foodDetail?.hasOwnProperty('id')) {
      window.scrollTo(0, 0)
    }
  }, [foodDetail, comments, loading])

  const likeHandler = async () => {
    try {
      MySwal.showLoading()

      await axios({
        method: 'post',
        url: `${String(window.env.BE_URL)}/recipes/like`,
        data: {
          recipes_uid: recipesUid
        },
        headers: {
          Authorization: token
        }
      })

      if (like) {
        const isContain = like.findIndex(recipe => recipe.recipes_uid === foodDetail.recipes_uid)

        if (isContain === -1) {
          dispatch(myRecipes.setLike([...like, foodDetail]))
        }
      }

      MySwal.fire({
        titleText: 'Liked',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    } catch (error) {
      console.log(error)
      MySwal.fire({
        titleText: 'Please Login First',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
  }

  const bookMarkHandler = async () => {
    try {
      MySwal.showLoading()

      await axios({
        method: 'post',
        url: `${String(window.env.BE_URL)}/recipes/bookmark`,
        data: {
          recipes_uid: recipesUid
        },
        headers: {
          Authorization: token
        }
      })

      if (bookmark) {
        const isContain = bookmark.findIndex(recipe => recipe.recipes_uid === foodDetail.recipes_uid)

        if (isContain === -1) {
          dispatch(myRecipes.setBookmark([...bookmark, foodDetail]))
        }
      }

      MySwal.fire({
        titleText: 'Saved',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    } catch (error) {
      MySwal.fire({
        titleText: 'Please Login First',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
  }

  return (
    <div>
      <Navbar />
      {loading === undefined ? (
        ''
      ) : loading === true ? (
        <Loading />
      ) : !foodDetail?.hasOwnProperty('id') ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: '43vh' }}
        >
          <Error404 />
          <p style={{ fontWeight: 600 }}>
            We're Sorry, Page you want to visit not found.
          </p>
        </div>
      ) : (
        <article
          id="foodRecipeDetail"
          className="container d-flex flex-column"
          style={{ padding: '3vh 10vw 3vh 10vw' }}
        >

          <section className="container d-flex flex-column m-auto">
            <h1 style={style.h1}>{foodDetail?.title}</h1>

            <figure className='d-flex flex-column justify-content-center align-items-center'
            >

              <div>
                <img
                  className="my-4"
                  style={{ borderRadius: '20px', width: '100', height: 400 }}
                  src={foodDetail?.image}
                  alt="foodDetail.title"
                />
              </div>

              <figcaption>{foodDetail?.title}</figcaption>
              <div className='mx-auto'>

                <button
                  className='btn'
                  onClick={() => likeHandler()}>
                  <Icons.ThumbsUp/>
                </button>

                <button
                  className='btn'
                  onClick={() => bookMarkHandler()}>
                  <Icons.Bookmark/>
                </button>
              </div>
            </figure>

            <div>
              <p>{foodDetail?.sort_desc}</p>
            </div>

            <div>
              <h3>Ingredients</h3>
              <ul>
                {ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Steps</h3>
              <ul>
                {steps?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Videos</h3>

              <div className="mt-2 desktop-component">
                <YouTube videoId={foodDetail?.video_url?.split('=')[1]} />
              </div>

              <ul className="mobile-component">
                <li>
                  <a href={foodDetail?.video_url} target="blank">
                    See Video On Youtube.
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {sucesNotif ? (
            <div className="alert alert-success" role="alert">
              {sucesNotif}
            </div>
          ) : null}

          {mesgError ? (
            <div className="alert alert-danger" role="alert">
              {mesgError}
            </div>
          ) : null}

          <div
            id="form-coment"
            className="text-center my-5 m-auto"
            style={{ width: '900px', maxWidth: '90%' }}
          >
            <textarea
              className="form-control mb-2"
              rows="3"
              style={{ backgroundColor: '#F6F5F4' }}
              onChange={(item) => {
                setUserComment(item.target.value)
              }}
            />
            <button
              className="btn my-2 shadow-sm"
              style={style.comentBtn}
              onClick={commentHandler}
            >
              Comment
            </button>
          </div>

          <div>
            <h2 className="mb-4" style={{ fontWeight: 600 }}>
              Comments
            </h2>
            {comments.length === 0
              ? 'No Comment Found'
              : comments?.map((item, index) => (
                <div key={index} className="d-flex flex-row gap-3 mt-3">
                  <div>
                    <img
                      style={{ width: '64px', borderRadius: '50%' }}
                      src={item.photo}
                      alt="profile"
                    />
                  </div>
                  <div>
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>Berkata "{item.message}"</p>
                  </div>
                </div>
              ))}
          </div>
        </article>
      )}
      <Footer />
    </div>
  )
}
