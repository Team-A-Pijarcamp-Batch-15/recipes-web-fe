/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from 'react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
// import Loading from "../../Components/Loading";
// import Error404 from "../../Components/Error404";
import { Player } from '@lottiefiles/react-lottie-player'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Loading from '../../Components/Loading'
import { current } from '@reduxjs/toolkit'

export default function SearchRecipe () {
  const [loading, setLoading] = React.useState(undefined)
  const [searchR, setSearchR] = React.useState(undefined)
  const [search, setSearch] = React.useState('')
  const [listRecipe, setListRecipe] = React.useState(undefined)
  const [mesgError, setMesgerror] = React.useState(null)

  const [curentPage, setCurentPage] = React.useState(1)
  const [amount, setAmount] = React.useState(6)
  const [sortBy, setSortBy] = React.useState('date')
  const [sortType, setSortType] = React.useState('desc')
  const [page, setPage] = React.useState(1)

  const initPage = async () => {
    try {
      setLoading(true)
      if (!listRecipe) {
        const list = await axios({
          method: 'get',
          url: `${window.env.BE_URL}/recipes/search?page=${curentPage}&amount=${amount}&sortBy=${sortBy}&sort=${sortType}`
        })
        setListRecipe(list.data.data.search)
        setCurentPage(list.data.pagination.page)
        setPage(list.data.pagination['page-length'])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePagination = async (pageParams) => {
    try {
      setLoading(true)
      const getData = await axios.get(`${window.env.BE_URL}/recipes/search?page=${pageParams}&amount=${amount}&sortBy=${sortBy}&sort=${sortType}`)
      console.log(getData)
      setListRecipe(getData.data.data.search)

      const list = await axios({
        method: 'get',
        url: `${window.env.BE_URL}/home/list`
      })

      setListRecipe(list.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTanyaButton = async () => {
    try {
      setLoading(true)

      const result = await axios({
        method: 'get',
        url: `${window.env.BE_URL}/recipes/search?title=${search}`
      })

      setSearchR(result.data.data.search)
    } catch (error) {
      if (error.response.status === 502) {
        setMesgerror('Bad Gateway')
      }
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    initPage()
  }, [])

  return (
    <div id="SearchPage">
      <Navbar />

      {/* Search Header */}

      <div className="container mx-auto" style={styles.body}>
        {mesgError
          ? (
            <div className="alert alert-danger" role="alert">
              {mesgError}
            </div>
          )
          : null}
        <Player
          autoplay
          loop
          src="/lotties/search.json"
          style={{ height: '300px', width: '300px' }}
        ></Player>
        <div className="mx-auto p-2" style={styles.searchTitle}>
          Cari apa, tanya mama 🙂
        </div>
        <div
          className="mx-auto"
          style={{
            width: '85%',
            display: 'flex',
            flexDirection: 'row',
            gap: 10
          }}
        >
          <input
            className="form-control px-2 py-1"
            autoFocus={true}
            style={{ height: '53px', borderRadius: 50, borderWidth: 2 }}
            type="search"
            name="search"
            id="search"
            placeholder="Mau cari resep apa...?"
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn"
            onClick={handleTanyaButton}
            style={styles.searchButton}
          >
            Tanya
          </button>
        </div>
      </div>

      {/* For Recipe Content */}
      {loading
        ? (
          <Loading />
        )
        : !listRecipe
          ? null
          : (
            <div className="container my-4" style={{ margin: '0 auto' }}>
              <div
                className="mx-auto p-2"
                style={{ fontWeight: 900, fontSize: 24 }}
              >
            Result ✨
              </div>
              <div className="row">
                {listRecipe?.map((recipe, index) => {
                  return (
                    <div
                      key={index}
                      className="col-lg-4 col-md-5 col-sm-6 col-xs-12 p-3 "
                    >
                      <Link
                        to={`/detail/${String(recipe.title)
                          .split(' ')
                          .join('-')
                          .toLowerCase()}/${recipe.recipes_uid}`}
                      >
                        <div
                          style={{
                            ...styles.resultCard,
                            backgroundImage: `url(${recipe.image})`
                          }}
                        >
                          <div
                            className="p-3"
                            style={styles.resultCardTitleContainer}
                          >
                            <p style={styles.resultCardTitle}>{recipe.title}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
      {/* End of Search Content */}

      {/* pagination */}
      <div className="container d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <div className="pagination">

            <a className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
            {[...new Array(page)]?.map((item, key) => {
              const incrementValueButton = ++key
              return (
                <div key={incrementValueButton}>
                  <div
                    key={key}
                    className="page-item"
                    onClick={() => handlePagination(incrementValueButton)}
                  >
                    <a className="page-link">{incrementValueButton}</a>
                  </div>
                </div>
              )
            })}
            <a className="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </div>
        </nav>
      </div>
      <Footer />
    </div>
  )
}

const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center'
  },
  searchTitle: {
    fontWeight: 900,
    fontSize: 24,
    marginTop: -70
  },
  searchButton: {
    backgroundColor: 'var(--recipe-color-yellow)',
    width: 120,
    borderRadius: 50,
    fontWeight: 800,
    color: 'white'
  },
  resultCard: {
    height: '160px',
    backgroundPosition: 'center',
    backgroundSize: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'flex',
    flexDirection: 'column-reverse',
    borderRadius: 20
  },
  resultCardTitleContainer: {
    backgroundColor: '#00000055',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  resultCardTitle: {
    textWrap: 'wrap',
    fontSize: '18px',
    fontWeight: 600,
    margin: 'unset',
    color: 'white'
  }
}
