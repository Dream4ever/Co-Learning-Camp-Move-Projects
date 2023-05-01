import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import Layout from 'containers/Layout'

import { Label, Input, Button, Select, Badge } from '@roketid/windmill-react-ui'
import ClearIcon from '../icons/Clear.svg'

import axios from 'axios'

const Home: NextPage = () => {
  const router = useRouter()

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchName, setSearchName] = useState('')
  const [aptosAddr, setAptosAddr] = useState('')
  const [chains, setChains] = useState([])
  const [status, setStatus] = useState([])
  const [filterTag, setFilterTag] = useState('')
  const [onlyOneProject, setOnlyOneProject] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      getAllProjects()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  useEffect(() => {
    setFilterByQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  useEffect(() => {
    if (filteredProjects.length === 1) {
      setOnlyOneProject(true)
    } else {
      setOnlyOneProject(false)
    }
  }, [filteredProjects])

  const filterTags = ['过滤方式', 'chain', 'status']

  const getAllProjects = async () => {
    const response = await axios.post('https://faasbyleeduckgo.gigalixirapp.com/api/v1/run?name=AwesomeMoveProjects&func_name=get_projects', {
      params: [],
    })
    setProjects(response.data.result)
    getAllChains(response.data.result)
    getAlLStatus(response.data.result)
  }

  const setFilterByQuery = () => {
    const { query } = router
    if (query.name) {
      setSearchName(query.name as string)
      filterByName(query.name as string)
    } else if (query.filter_by_chain) {
      setFilterTag('chain')
      filterByCatg('chain', query.filter_by_chain as string)
    } else if (query.filter_by_status) {
      setFilterTag('status')
      filterByCatg('status', query.filter_by_status as string)
    } else if (query.hodler_aptos_addr) {
      setAptosAddr(query.hodler_aptos_addr as string)
      filterByAddr(query.hodler_aptos_addr as string)
    } else {
      setFilteredProjects(projects)
    }
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

  const handleAddrInputChange = (e: any) => {
    const text = e.target.value
    setAptosAddr(text)
  }

  const onClickSearch = () => {
    filterByName(searchName)
    router.replace({
      query: { name: searchName },
    })
  }

  const handleAddrSearch = () => {
    filterByAddr(aptosAddr)
    router.replace({
      query: { hodler_aptos_addr: aptosAddr },
    })
  }

  const filterByName = (name: string) => {
    const filtered = projects.filter((project: any) => {
      return project.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    })
    setFilteredProjects(filtered)
  }

  const filterByAddr = (addr: string) => {
    const filtered = projects.filter((project: any) => {
      return project.hodler_aptos_addr && (project.hodler_aptos_addr.toLowerCase().indexOf(addr.toLowerCase()) !== -1)
    })
    setFilteredProjects(filtered)
  }

  const handleNameInputKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onClickSearch()
    }
  }

  const handleAddrInputKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleAddrSearch()
    }
  }

  const clearSearch = () => {
    setSearchName('')
    router.replace({
      query: {},
    })
    setFilteredProjects(projects)
  }

  const clearAddrSearch = () => {
    setAptosAddr('')
    router.replace({
      query: {},
    })
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
      router.replace({
        query: { filter_by_chain: content },
      })
    } else if (catg === 'status') {
      const filtered = projects.filter((project: any) => {
        return project.status === content
      })
      setFilteredProjects(filtered)
      router.replace({
        query: { filter_by_status: content },
      })
    }
  }

  const onClearFilter = () => {
    setFilterTag('')
    setFilteredProjects(projects)
    router.replace({
      query: {},
    })
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
            <Input
              className='w-40'
              placeholder='请输入项目名'
              value={searchName}
              onChange={(e) => onSearchNameChange(e)}
              onKeyDown={handleNameInputKeyDown}
            />
            {searchName.length > 0 && (
              <ClearIcon
                onClick={clearSearch}
                className='absolute right-2 top-3 cursor-pointer fill-purple-600 w-4 h-4'
              />
            )}
          </span>
          <Button disabled={!searchName.length} onClick={onClickSearch}>搜索</Button>
        </Label>
        {/* 按 aptos addr 搜索 */}
        <Label className='flex gap-x-4 items-center'>
          <span className=''>按 APTOS ADDR 搜索：</span>
          <span className='flex relative'>
            <Input
              className='w-40'
              placeholder='请输入地址'
              value={aptosAddr}
              onChange={(e) => handleAddrInputChange(e)}
              onKeyDown={handleAddrInputKeyDown}
            />
            {aptosAddr.length > 0 && (
              <ClearIcon
                onClick={clearAddrSearch}
                className='absolute right-2 top-3 cursor-pointer fill-purple-600 w-4 h-4'
              />
            )}
          </span>
          <Button disabled={!aptosAddr.length} onClick={handleAddrSearch}>搜索</Button>
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
          <Button disabled={!filterTag} onClick={onClearFilter}>清空</Button>
        </div>
      </div>
      {/* 项目列表 */}
      <div className={`projects grid gap-4 ${onlyOneProject ? 'grid-cols-1' : 'grid-cols-5'}`}>
        {filteredProjects.map((project: any, i) => (
          <div
            className={`card border border-gray-300 rounded-lg ${onlyOneProject ? "basis-1" : "basis-1/5"}`}
            key={i}
          >
            {/* 项目卡片 */}
            {/* 项目 logo */}
            <div className={`logo ${onlyOneProject ? 'h-72' : 'h-40'} border-b border-gray-200`}>
              {project.logo && (
                <Image src={project.logo} alt='logo' />
              )}
            </div>
            {/* 项目介绍文字 */}
            <div className={`info ${onlyOneProject ? 'h-96 items-center' : ''} p-4 flex flex-col justify-between gap-y-2`}>
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
              {project.hodler_aptos_addr && (
                <div className='flex flex-wrap items-center gap-1'>
                  <Badge type='success'>{project.hodler_aptos_addr}</Badge>
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
