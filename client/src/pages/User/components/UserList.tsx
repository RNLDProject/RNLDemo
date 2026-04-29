import Spinner from "../../../components/Spinner/Spinner";
import UserService from "../../../services/UserService";
import { useState, useEffect, type FC, useRef, useCallback } from "react"; 
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHeader, 
  TableRow 
} from "../../../components/table";
import type { UserColumns } from "../../../interfaces/UserInterface";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";

interface UserListProps {
  onAddUser: () => void;
  onEditUser: (user: any) => void;
  onDeleteUser: (user: any) => void;
  refreshKey: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const UserList: FC<UserListProps> = ({
  onAddUser,
  onEditUser,
  onDeleteUser,
  refreshKey,
}) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserColumns[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userTableCurrentPage, setUserTableCurrentPage] = useState(1);
  const [, setUserTableLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadUsers = async (page: number, append = false, searchTerm = "") => {
    try {
      setLoadingUsers(true);
      const res = await UserService.loadUsers(page, searchTerm);
      
      if (res.status === 200) {
        const usersData = res.data.users.data || res.data.users || [];
        const lastPage = res.data.users.last_page || res.data.last_page || 1;
        
        setUsers(append ? [...users, ...usersData] : usersData);
        setUserTableCurrentPage(page);
        setUserTableLastPage(lastPage);
        setHasMore(page < lastPage);
      } else {
        setUsers(append ? users : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Unexpected server error occurred during loading users: ", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;
    if (ref && ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 && hasMore && !loadingUsers) {
      handleLoadUsers(userTableCurrentPage + 1, true, debouncedSearch);
    }
  }, [hasMore, loadingUsers, userTableCurrentPage, debouncedSearch]);

  
  const handleUserFullNameFormat = (user: UserColumns) => {
    let fullName = "";
    if (user.middle_name) {
      fullName = `${user.last_name}, ${user.first_name} ${user.middle_name.charAt(0)}.`;
    } else {
      fullName = `${user.last_name}, ${user.first_name}`;
    }
    if (user.suffix_name && user.suffix_name !== "null") {
        fullName += ` ${user.suffix_name}`;
    }
    return fullName;
  };
  
  useEffect(() => {
    const ref = tableRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setUsers([]);
    setUserTableCurrentPage(1);
    setHasMore(true);
    handleLoadUsers(1, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div 
        ref={tableRef} 
        className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-y-auto overflow-x-auto"
      >
        <Table className="table-fixed min-w-[900px] w-full">
          <caption className="mb-4">
            <div className="border-b border-gray-100 p-4 flex justify-between items-center">
              <div className='w-64'>
                <FloatingLabelInput 
                  label='Search' 
                  type='text' 
                  name='search' 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus 
                />
              </div>
              <button
                type="button"
                onClick={onAddUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer"
              >
                Add User
              </button>
            </div>
          </caption>

          <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs z-10">
            <TableRow>
              <TableCell isHeader className="w-[5%] px-5 py-3 font-medium text-center">No.</TableCell>
              
              <TableCell isHeader className="w-[8%] px-5 py-3 font-medium text-center">Photo</TableCell>
              <TableCell isHeader className="w-[25%] px-5 py-3 font-medium text-start">Full Name</TableCell>
              <TableCell isHeader className="w-[15%] px-5 py-3 font-medium text-start">Gender</TableCell>
              <TableCell isHeader className="w-[15%] px-5 py-3 font-medium text-start">Birth Date</TableCell>
              <TableCell isHeader className="w-[8%] px-5 py-3 font-medium text-start">Age</TableCell>
              <TableCell isHeader className="w-[12%] px-5 py-3 font-medium text-center">Action</TableCell>
            </TableRow>
          </TableHeader>

          
          <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
            {(users.length ?? 0) > 0 ? (
              users.map((user, index) => (
                <TableRow className="hover:bg-gray-100" key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {index + 1}
                  </TableCell>

                 
                  <TableCell className="py-3 items-end justify-end">
                    {user.profile_picture ? (
                       <img 
                         src={user.profile_picture} 
                         alt={handleUserFullNameFormat(user)} 
                         className="object-cover w-10 h-10 rounded-full"
                       />
                    ) : (
                       <div className="relative inline-flex items-center justify-center overflow-hidden bg-gray-300 rounded-full w-10 h-10">
                         <span className="font-medium text-gray-600">
                           {`${user.last_name.charAt(0)}${user.first_name.charAt(0)}`}
                         </span>
                       </div>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    {handleUserFullNameFormat(user)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                      {(user.gender as any)?.gender || user.gender}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    {user.birth_date}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    {user.age}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex gap-4 justify-center">
                      <button 
                        type="button" 
                        onClick={() => onEditUser(user)} 
                        className="text-green-600 font-medium cursor-pointer hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => onDeleteUser(user)} 
                        className="text-red-600 font-medium cursor-pointer hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loadingUsers && (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-3 text-center">No Records Found</TableCell>
                </TableRow>
              )
            )}

            {loadingUsers && (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-3 text-center">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;