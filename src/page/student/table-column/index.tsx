

import { TableProps } from "antd";
import { IUser } from "@/interface/user";

export const columns = (): TableProps<IUser>['columns'] => {
    return [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
         
        },
        {
          title: 'Full Name',
          dataIndex: 'fullName',
          key: 'fullName',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
        }
      ]
}