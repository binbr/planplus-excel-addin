import * as React from 'react'
import Select from 'antd/lib/select'
import './index.less'

interface SearchBarProps {
  searchKeys: Array<string>
}
interface SearchBarStates {
  changeItems: Array<number>
}

export default class SearchBar extends React.Component<SearchBarProps> {
  state: SearchBarStates = {
    changeItems: []
  }
  onSearch = (v: any) => {
    console.log(v)
    this.setState({ changeItems: v })
  }

  render() {
    const { searchKeys } = this.props
    const { changeItems } = this.state
    return (
      <div className='search'>
        <Select onChange={this.onSearch} value={changeItems} mode='multiple' style={{width: '100%'}} placeholder="输入内容搜索" showSearch allowClear>
        {
          searchKeys.map((item, idx) => { 
            return <Select.Option key={idx} label={item}><code>{item}</code></Select.Option>
          })
        }
        </Select>
      </div>
    )
  }
}

