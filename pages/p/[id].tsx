import React from 'react'
import { GetServerSideProps } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import Router from 'next/router'
import { PostProps } from '../../components/Post'
import { useSession } from 'next-auth/client'
import prisma from '../../lib/prisma'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  return {
    props: post,
  }
}

async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: 'DELETE',
  })
  Router.push('/')
}

const Post: React.FC<PostProps> = (props) => {
  const [session, loading] = useSession()
  if (loading) {
    return <div>Authenticating ...</div>
  }
  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.email === props.author?.email
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || 'Unknown author'}</p>
        <ReactMarkdown source={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {
          userHasValidSession && postBelongsToUser && (
            <button className="delete-btn" onClick={() => deletePost(props.id)}>Delete</button>
          )
        }

      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }

        .delete-btn {
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

        .delete-btn:hover {
          background-color: #f64e60;
          color: #fff;
        }
      `}</style>
    </Layout>
  )
}

export default Post