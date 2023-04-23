import Main from './Main'

interface ILayout {
  children: React.ReactNode
}

function Layout({ children }: ILayout) {

  return <div
    className={"flex min-h-screen pb-8 bg-gray-50 dark:bg-gray-900"}
  >
    <div className="flex flex-col flex-1 w-full">
      <Main>
        {children}
      </Main>
    </div>
  </div>
}

export default Layout
