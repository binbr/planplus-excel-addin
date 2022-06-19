import * as React from 'react'
import { Layout } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'
import './app.less'
import UserBar from './components/user-bar'
import SearchBar from './components/search-bar'

const { Header, Content, Footer } = Layout

interface AppStates {
  userInfo: {
    id: number,
    userName?: string
  }
  searchKeys: Array<string>
}

export default class App extends React.Component {
  state: AppStates = {
    userInfo: {id: 1, userName: 'binbr'},
    searchKeys: ['8016', '8012', 'K7', 'C8X', 'PL1001', 'PL1001Fe', 'PL10011']
  }
  render() {
    const { userInfo, searchKeys } = this.state
    return (
      <Layout>
        <Header>
          <UserBar userInfo={userInfo}/>
        </Header>
        <Content>
          <SearchBar searchKeys={searchKeys}/>
        </Content>
        <Footer><span>Developed by </span><CopyrightOutlined /><u>Peng Zhihua</u></Footer>
      </Layout>
    )
  }
}
