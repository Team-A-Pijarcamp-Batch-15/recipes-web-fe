/* eslint-disable react/prop-types */
import React from 'react'
import * as Icons from 'react-feather'
import { Link } from 'react-router-dom'
import './style.css'

export default function RecipeCardPrivate ({ image, title, to, removeHandler }) {
  const styles = {
    backgroundImage: {
      backgroundImage: `url(${image})`,
      height: 160,
      width: 260,
      margin: 10,
      borderRadius: 10,
      objectFit: 'cover',
      backgroundRepeat: 'unset',
      backgroundSize: '100%',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'flex-end',
      position: 'relative'
    },
    cardLable: {
      backgroundColor: '#00000088',
      color: 'white',
      width: '100%',
      height: 'fit-content',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <Link to={to}>
        <div className='RecipeCardPrivate'
          style={styles.backgroundImage}>
          <div className='p-2 d-flex justify-content-between'
            style={styles.cardLable}>
            <h5 style={{ fontSize: 14 }}>{title}</h5>
          </div>
        </div>
      </Link>
      <button className='btn remove-button' onClick={removeHandler}>
        <p style={{ fontWeight: 800, marginBottom: 'unset' }}>
          Remove {' '}
          <Icons.XCircle className='remove-cross' size={26} />
        </p>
      </button>
    </div>

  )
}
