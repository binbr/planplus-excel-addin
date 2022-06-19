import * as React from 'react'
import './index.less'

interface UserBarProps {
  userInfo: {
    id: number,
    userName?: string
  }
}

export default class UserBar extends React.Component<UserBarProps> {
  render() {
    const { userName } = this.props.userInfo
    return (
      <>
        <span >欢迎，</span><span className='user-name'>{ userName }</span>
      </>
    )
  }
}
