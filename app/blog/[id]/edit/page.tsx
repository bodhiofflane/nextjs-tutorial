type Props = {
  params: {
    id: string;
  }
}

const EditPage = ({params}: Props) => {
  return (<h1>Редактирование {params.id}</h1>);
}
 
export default EditPage;