'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [editingId, setEditingId] = useState (null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')


  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user)
    if (data.user) fetchBookmarks(data.user.id)
  })

  const channel = supabase
    .channel('realtime-bookmarks')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookmarks' },
      () => {
        if (user) fetchBookmarks(user.id)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user])

  useEffect(() => {
  if (!user) return

  fetchBookmarks(user.id)

    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        () => fetchBookmarks(user?.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

 const fetchBookmarks = async (userId) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      if (data){
        setBookmarks(data)
      }
  }

  const addBookmark = async () => {
    if (!title || !url) return
    await supabase.from('bookmarks').insert([
      { title, url, user_id: user.id }
    ])
    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }
  const startEdit = (bookmark) => {
  setEditingId(bookmark.id)
  setEditTitle(bookmark.title)
  setEditUrl(bookmark.url)
}

const updateBookmark = async (id) => {
  await supabase
    .from('bookmarks')
    .update({
      title: editTitle,
      url: editUrl
    })
    .eq('id', id)

  setEditingId(null)
}


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: 'google' })
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow"
        >
          Login with Google
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Bookmarks</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-red-500"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-1/3"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border p-2 rounded w-2/3"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={addBookmark}
            className="bg-green-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <a
                href={b.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                {b.title}
              </a>
              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}