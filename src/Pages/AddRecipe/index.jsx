import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar/index'
import Footer from '../../Components/Footer/index'
import { Player } from '@lottiefiles/react-lottie-player'
import './addRecipe.css'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const styles = {
  recipeImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 40
    // justifyContent: 'center',
    // alignContent: 'center'
  },
  textInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  }
}

export default function AddRecipe () {
  const [ingredients, setIngredients] = React.useState([''])
  const [steps, setSteps] = React.useState([''])
  const [video, setVideo] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [recipeImage, setRecipeImage] = React.useState(undefined)
  const [preview, setPreview] = React.useState(undefined)
  const navigate = useNavigate()
  const { user, token } = useSelector(state => state.auth)
  const MySwal = withReactContent(Swal)

  const handleAddRecipe = async (e) => {
    try {
      MySwal.showLoading()

      const form = new FormData()
      form.append('recipe-image', recipeImage)
      form.append('title', title)
      form.append('video', video)
      form.append('description', description)
      form.append('ingredients', JSON.stringify(ingredients))
      form.append('steps', JSON.stringify(steps))

      const recipeAdd = await axios.post(
        `${String(window.env.BE_URL)}/recipes/add`,
        form,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      MySwal.fire({
        titleText: 'Recipe Added',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
      navigate(`/detail/${title.split(' ').join('-').toLowerCase()}/${recipeAdd.data.data.recipes_uid}`)
    } catch (error) {
      console.log(error)
      MySwal.fire({
        titleText: JSON.stringify(error.response.data.message),
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
  }

  //
  // For the Ingredients
  //
  const handleAddInputIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const handleChangeIngredient = (event, index) => {
    const { value } = event.target
    const onChangeValue = [...ingredients]
    onChangeValue[index] = value
    setIngredients(onChangeValue)
  }

  const handleDeleteInputIngredient = (index) => {
    const newArray = [...ingredients]
    newArray.splice(index, 1)
    setIngredients(newArray)
  }

  //
  // For the Steps
  //
  const handleAddInputStep = () => {
    setSteps([...steps, ''])
  }

  const handleChangeStep = (event, index) => {
    const { value } = event.target
    const onChangeValue = [...steps]
    onChangeValue[index] = value
    setSteps(onChangeValue)
  }

  const handleDeleteStep = (index) => {
    const newArray = [...steps]
    newArray.splice(index, 1)
    setSteps(newArray)
  }

  React.useEffect(() => {
    if (!user & !token) {
      navigate('/')
    }
  }, [])

  return (
    <div id='AddRecipe'>
      <Navbar />

      <div className='container my-5'>
        <div className='row mx-auto' style={{ maxWidth: 640 }}>
          <div className='container my-3 justify-content-center' style={styles.recipeImageContainer}>
            <div className='container mx-auto animation' style={{ width: 600, height: 300 }}>
              {
                preview === undefined
                  ? <>

                    <Player autoplay loop
                      src="/lotties/search.json" style={{ height: '300px', width: '300px' }} />
                    <p className='text-center' style={{ marginTop: -30 }}>Add Recipe Photo</p>

                  </>

                  : <img style={{ width: '100%', height: '100%', borderRadius: 20, objectFit: 'cover', objectPosition: 'center' }}
                    src={preview} alt="preview" />
              }
            </div>
            <input className='form-control mx-auto' style={{ maxWidth: 400 }} type="file" accept="image/*"
              onChange={e => {
                setPreview(URL.createObjectURL(e.target.files[0]))
                setRecipeImage(e.target.files[0])
              }} />

          </div>

          <div className='my-3' style={styles.textInputContainer}>
            <input className='form-control' type="text" placeholder='Title' onChangeCapture={e => setTitle(e.target.value)} />
            <textarea className='form-control' type="text" placeholder='Description' rows={6} onChangeCapture={e => setDescription(e.target.value)} />
            <input className='form-control' type="text" placeholder='Any video? It suggest use youtube videos...'
              onChangeCapture={e => setVideo(e.target.value)} />
          </div>

          <div className='my-3' style={styles.textInputContainer}>
            <p>Ingredients</p>
            {ingredients.map((item, index) => (
              <div className="input_container gap-2" style={{ display: 'flex', width: '100%' }} key={index}>
                <input
                  className='form-control'
                  placeholder='Ingredient Name'
                  type="text"
                  value={item}
                  onChange={(event) => handleChangeIngredient(event, index)}
                />
                {ingredients.length > 1 && (
                  <button className='btn btn-danger' onClick={() => handleDeleteInputIngredient(index)}>Delete</button>
                )}
                {index === ingredients.length - 1 && (
                  <button className='btn btn-success' onClick={() => handleAddInputIngredient()}>Add</button>
                )}
              </div>
            ))}

            {/* <div className="body"> {JSON.stringify(ingredients)} </div> */}
          </div>

          <div className='my-3' style={styles.textInputContainer}>
            <p>Steps</p>
            {steps.map((item, index) => (
              <div className="input_container gap-2" style={{ display: 'flex', width: '100%' }} key={index}>
                <input
                  className='form-control'
                  placeholder={index === 0
                    ? 'Tell Me'
                    : 'Tell Me More...'}
                  type="text"
                  value={item}
                  onChange={(event) => handleChangeStep(event, index)}
                />
                {steps.length > 1 && (
                  <button className='btn btn-danger' onClick={() => handleDeleteStep(index)}>Delete</button>
                )}
                {index === steps.length - 1 && (
                  <button className='btn btn-success' onClick={() => handleAddInputStep()}>Add</button>
                )}
              </div>
            ))}

            {/* <div className="body"> {JSON.stringify(steps)} </div> */}
          </div>

          <div className='my-3' style={styles.textInputContainer}>
            <button className='btn'
              style={{
                backgroundColor: 'var(--recipe-color-yellow)',
                color: 'var(--recipe-color-lavender)',
                fontWeight: 800
              }}
              onClick={handleAddRecipe}>Add Recipe</button>
          </div>

        </div>

      </div>

      <Footer/>
    </div>
  )
}
