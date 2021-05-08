
import React, { useState } from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'

const Draft: React.FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      const body = { title, content }
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await Router.push('/drafts')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className="back btn" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
          cursor: pointer;
        }

        input[type='submit']:disabled {
          cursor: not-allowed;
        }

        .back {
          margin-left: 1rem;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          color: #f64e60;
          text-align: center;
          vertical-align: middle;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          background-color: transparent;
          border: 1px solid #f64e60;
          padding: .65rem 1rem;
          font-size: 1rem;
          line-height: 1.5;
          border-radius: .42rem;
          -webkit-transition: color .3s ease-in-out,background-color .3s ease-in-out,border-color .3s ease-in-out,-webkit-box-shadow .3s ease-in-out;
          transition: color .3s ease-in-out,background-color .3s ease-in-out,border-color .3s ease-in-out,-webkit-box-shadow .3s ease-in-out;
          transition: color .3s ease-in-out,background-color .3s ease-in-out,border-color .3s ease-in-out,box-shadow .3s ease-in-out;
          transition: color .3s ease-in-out,background-color .3s ease-in-out,border-color .3s ease-in-out,box-shadow .3s ease-in-out,-webkit-box-shadow .3s ease-in-out;
        }

        .btn:hover {
          background-color: #f64e60;
          color: #fff;
        }
      `}</style>
    </Layout>
  )
}

export default Draft