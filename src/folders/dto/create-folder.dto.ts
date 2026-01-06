export class CreateFolderDto {
  name: string;
  parentId?: string | null;
  isPublic: boolean;
}