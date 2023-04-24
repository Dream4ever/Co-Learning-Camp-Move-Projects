import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Layout from 'containers/Layout'

import { Label, Input, Button, Select, Badge } from '@roketid/windmill-react-ui'
import ClearIcon from '../icons/Clear.svg'

import axios from 'axios'

const Home: NextPage = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchName, setSearchName] = useState('')
  const [chains, setChains] = useState([])
  const [status, setStatus] = useState([])
  const [filterTag, setFilterTag] = useState('')

  useEffect(() => {
    getAllProjects()
  }, [])

  const filterTags = ['过滤方式', 'chain', 'status']

  const getAllProjects = async () => {
    const response = await axios.post('https://faasbyleeduckgo.gigalixirapp.com/api/v1/run?name=AwesomeMoveProjects&func_name=get_projects', {
      params: [],
    })
    setProjects(response.data.result)
    setFilteredProjects(response.data.result)
    getAllChains(response.data.result)
    getAlLStatus(response.data.result)
  }

  const getAllChains = (data: any) => {
    const allChains: any = []
    data.forEach((item: any) => {
      if (item.chains && !allChains.includes(item.chains)) {
        allChains.push(...item.chains)
      }
    })
    setChains(['', ...new Set(allChains)] as any)
  }

  const getAlLStatus = (data: any) => {
    const allStatus: any = []
    data.forEach((item: any) => {
      if (item.status && !allStatus.includes(item.status)) {
        allStatus.push(item.status)
      }
    })
    setStatus(['', ...new Set(allStatus)] as any)
  }

  const onSearchNameChange = (e: any) => {
    const text = e.target.value
    setSearchName(text)
  }

  const onClickSearch = () => {
    filterByName(searchName)
  }

  const filterByName = (name: string) => {
    const filtered = projects.filter((project: any) => {
      return project.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    })
    setFilteredProjects(filtered)
  }

  const clearSearch = () => {
    setSearchName('')
    setFilteredProjects(projects)
  }

  const changeFilterTag = (e: any) => {
    if (e.target.value !== filterTags[0]) {
      setFilterTag(e.target.value)
    }
  }

  const changeFilterContent = (e: any) => {
    const text = e.target.value
    filterByCatg(filterTag, text)
  }

  const filterByCatg = (catg: string, content: string) => {
    if (catg === 'chain') {
      const filtered = projects.filter((project: any) => {
        return project.chains && project.chains.includes(content)
      })
      setFilteredProjects(filtered)
    } else if (catg === 'status') {
      const filtered = projects.filter((project: any) => {
        return project.status === content
      })
      setFilteredProjects(filtered)
    }
  }

  const onClickFilter = () => {
    setFilterTag('')
    setFilteredProjects(projects)
  }

  return (
    <Layout>
      {/* 顶部标题 */}
      <div className='pt-8 pb-12 text-6xl font-bold'>Co-Learning-Camp Move Projects</div>
      {/* 操作栏 */}
      <div className="pb-8 flex items-center justify-between">
        {/* 按项目名称搜索 */}
        <Label className='flex gap-x-4 items-center'>
          <span className=''>按项目名称搜索：</span>
          <span className='flex relative'>
            <Input className='w-40' placeholder='请输入函数名' value={searchName} onChange={(e) => onSearchNameChange(e)} />
            {searchName.length > 0 && (
              <ClearIcon onClick={clearSearch} className='absolute right-2 top-3 cursor-pointer fill-purple-600 w-4 h-4' />
            )}
          </span>
          <Button disabled={!searchName.length} onClick={onClickSearch}>搜索</Button>
        </Label>
        {/* 按链和状态过滤 */}
        <div className='flex gap-x-4 items-center'>
          <Select className="w-32" defaultValue={filterTags[0]} onChange={(e) => changeFilterTag(e)}>
            {filterTags.length > 0 && (
              filterTags.map((tag: string, i: number) => (
                <option disabled={tag === filterTags[0]} key={i} value={tag}>{tag}</option>
              ))
            )}
          </Select>
          <Select className="w-32" defaultValue={filterTag === 'chain' ? chains[0] : status[0]} onChange={(e) => changeFilterContent(e)}>
            {(filterTag === 'chain') && (
              chains.map((item: string, i: number) => (
                <option key={i} value={item}>{item}</option>
              ))
            )}
            {(filterTag === 'status') && (
              status.map((item: string, i: number) => (
                <option key={i} value={item}>{item}</option>
              ))
            )}
          </Select>
          <Button disabled={!filterTag} onClick={onClickFilter}>清空</Button>
        </div>
      </div>
      {/* 项目列表 */}
      <div className="projects grid grid-cols-5 gap-4">
        {filteredProjects.map((project: any, i) => (
          <div className='card basis-1/5 border border-gray-300 rounded-lg' key={i}>
            {/* 项目卡片 */}
            {/* 项目 logo */}
            <div className='logo h-40 border-b border-gray-200'>
              {project.logo && (
                <Image src={project.logo} alt='logo' />
              )}
            </div>
            {/* 项目介绍文字 */}
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
