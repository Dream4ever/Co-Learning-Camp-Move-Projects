import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Layout from 'containers/Layout'

import { Badge } from '@roketid/windmill-react-ui'

import axios from 'axios'

const Home: NextPage = () => {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    request()
  }, [])

  const request = async () => {
    const response = await axios.post('https://faasbyleeduckgo.gigalixirapp.com/api/v1/run?name=AwesomeMoveProjects&func_name=get_projects', {
      params: [],
    })
    setProjects(response.data.result)
  }

  return (
    <Layout>
      <div className='pt-8 pb-12 text-6xl font-bold'>Co-Learning-Camp Move Projects</div>
      <div className="projects grid grid-cols-5 gap-4">
        {projects.map((project: any, i) => (
          <div className='card basis-1/5 border border-gray-300 rounded-lg' key={i}>
            <div className='logo h-40 border-b border-gray-200'>
              {project.logo && (
                <Image src={project.logo} alt='logo' />
              )}
            </div>
            <div className='info p-4 flex flex-col gap-y-2'>
              <div className='pb-1 text-lg font-bold'>{project.name}</div>
              {project.homepage && (
                <Link href={project.homepage} passHref>
                  <span className='text-sm text-gray-500 underline cursor-pointer'>{project.homepage.replace(/^https:\/\//, '')}</span>
                </Link>
              )}
              {project.github && (
                <Link href={project.github} passHref>
                  <span className='text-sm text-gray-500 underline cursor-pointer'>{project.github.replace(/^https:\/\/github.com\//, '')}</span>
                </Link>
              )}
              {project.prizes && (
                <div className='flex flex-wrap items-center gap-1'>
                  {project.prizes.map((prize: any, i: number) => (
                    <Badge key={i}>{prize}</Badge>
                  ))}
                </div>
              )}
              {project.chains && (
                <div className='flex flex-wrap items-center gap-1'>
                  {project.chains.map((chain: any, i: number) => (
                    <Badge type='success' key={i}>{chain}</Badge>
                  ))}
                </div>
              )}
              {project.status && (
                <div className='flex flex-wrap'>
                  <Badge type='neutral'>{project.status}</Badge>
                </div>
              )}
              {project.members_list && (
                <div className='flex flex-wrap items-center gap-1'>
                  {project.members_list.map((member: any, i: number) => (
                    <Badge type='warning' key={i}>{member}</Badge>
                  ))}
                </div>
              )}
              {project.description && (
                <div className='mt-2 flex flex-wrap'>{project.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Home
