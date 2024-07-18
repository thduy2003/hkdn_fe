import { Button, Col, Input, Row, Spin, Table } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { ExpandableConfig } from 'antd/es/table/interface'
export interface DataTableProps<DataType> {
  columns: ColumnsType<AnyObject> | undefined
  dataSource: AnyObject[] | undefined
  isLoading: boolean
  onChange: (pagination: TablePaginationConfig) => void
  currentPage: number
  pageSize: number
  total: number | undefined
  showSizeChanger?: boolean
  pageSizeOptions?: string[] | number[] | undefined
  rowKey: string | number
  onChangeSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onReset?: () => void
  onSearch?: () => void
  valueSearch?: string | number
  addButtonRender?: () => React.ReactNode
  customSearchFrom?: () => React.ReactNode
  expandable?: ExpandableConfig<DataType> | undefined
  scroll?:
    | ({
        x?: number | true | string
        y?: number | string
      } & {
        scrollToFirstRowOnChange?: boolean
      })
    | undefined
}
export default function DataTable<DataType>({
  columns,
  dataSource,
  isLoading,
  onChange,
  currentPage,
  pageSize,
  total,
  showSizeChanger,
  pageSizeOptions,
  onChangeSearch,
  onReset,
  onSearch,
  valueSearch,
  rowKey,
  addButtonRender,
  customSearchFrom,
  expandable,
  scroll
}: DataTableProps<DataType>) {
  return (
    <div>
      {onChangeSearch && onReset && onSearch && (
        <Row gutter={[16, 16]} className='mb-5 items-center'>
          <Col span={3}>Tìm kiếm:</Col>
          <Col span={10}>
            <Input value={valueSearch} placeholder='Search...' className='w-full' onChange={onChangeSearch} />
          </Col>
          <Col span={5}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button className='w-full' onClick={onReset} type='default'>
                  Reset
                </Button>
              </Col>
              <Col span={12}>
                <Button className='w-full' onClick={onSearch} type='primary'>
                  Search
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {customSearchFrom && (
        <Row gutter={[16, 16]} className='mb-5 items-center'>
          <Col span={24}>
            <div className=''>{customSearchFrom()}</div>
          </Col>
        </Row>
      )}
      {addButtonRender && (
        <Row gutter={[16, 16]} className='mb-5 items-center'>
          <Col span={24}>
            <div className='flex justify-end'>{addButtonRender()}</div>
          </Col>
        </Row>
      )}
      <Table
        columns={columns}
        rowKey={rowKey}
        dataSource={dataSource}
        loading={{
          indicator: (
            <div>
              <Spin size='large'>
                <div className='content' />
              </Spin>
            </div>
          ),
          spinning: isLoading
        }}
        onChange={(pagination) => onChange(pagination)}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: showSizeChanger ? showSizeChanger : undefined,
          pageSizeOptions: pageSizeOptions ? pageSizeOptions : undefined,
          onChange: (page, size) => onChange({ current: page, pageSize: size })
        }}
        expandable={expandable ? (expandable as ExpandableConfig<AnyObject>) : undefined}
        scroll={scroll ? scroll : undefined}
      />
    </div>
  )
}
