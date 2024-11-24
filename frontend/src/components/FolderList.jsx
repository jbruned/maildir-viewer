import { LoadingScreen } from './LoadingScreen'

export function FolderList({ folders, currPath, nestedPath, onSelectFolder }) {
    return <ul className={nestedPath ? 'nested-folder list-unstyled' : 'folder-list list-unstyled'}>
        {folders === null ? <LoadingScreen /> : Object.keys(folders).map(folder => {
            const path = nestedPath ? `${nestedPath}/${folder}` : folder
            const folderName = currPath.replace(/\d+$/, '').replace(/\/$/, '')
            return <li key={path}>
                <a className={folderName === `/${path}` ? 'active' : ''} key={`${path}-link`} onClick={() => onSelectFolder(path)}>
                    {folder}
                </a>
                {typeof folders[folder] === 'object' ? (
                    <FolderList folders={folders[folder]} currPath={currPath} nestedPath={path} onSelectFolder={onSelectFolder}
                        key={`${path}-nested`} />
                ) : null}
            </li>
        })}
    </ul>
}
