import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import TextInput from "../../app/common/form/TextInpust";
import TextArea from "../../app/common/form/TextArea";
import { Button } from "semantic-ui-react";

interface Props {
    setEditMode: (editMode: boolean) => void;
   }

   export default observer(function ProfileEdit({setEditMode}: Props) {
    const {profileStore: {profile, updateProfile}} = useStore();
    return (
        <Formik
            initialValues={{displayName: profile?.displayName, bio:
            profile?.bio}}
            onSubmit={values => {
                updateProfile(values).then(() => {
                setEditMode(false);
                })
            }}

            validationSchema={Yup.object({
                displayName: Yup.string().required()
            })}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className='ui form'>
                    <TextInput placeholder='Display Name'
                        name='displayName' />
                    <TextArea rows={3} placeholder='Add your bio'
                        name='bio' />
                    <Button 
                        positive
                        type='submit'
                        loading={isSubmitting}
                        content='Update profile'
                        floated='right'
                        disabled={!isValid || !dirty}
                />
                </Form>
            )}
        </Formik>
        )
   })