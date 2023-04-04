import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid} from 'uuid';
import { Formik, Form } from 'formik';
import * as Yap from 'yup';
import TextInput from '../../../app/common/form/TextInpust';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: '',
    });

    const validationSchema = Yap.object({
        title: Yap.string().required('The title field is required'),
        description: Yap.string().required('The description field is required'),
        category: Yap.string().required(),
        date: Yap.string().required('Date is required').nullable(),
        venue: Yap.string().required(),
        city: Yap.string().required(),
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id,loadActivity])

    function handleFormSubmit(activity: Activity) {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    // function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     const {name,value} = event.target;
    //     setActivity({...activity, [name]: value});
    // }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <TextInput name='title' placeholder='Title'/>
                    <TextArea rows={3} placeholder='Description' name='description'/>
                    <SelectInput options={categoryOptions} placeholder='Category'  name='category'/>
                    <DateInput 
                        showTimeSelect
                        timeCaption='time'
                        dateFormat='MMMM d, yyyy h:mm aa'
                        placeholderText='Date' 
                        name='date'
                    />
                    <Header content='Location Details' sub color='teal' />
                    <TextInput placeholder='City' name='city'/>
                    <TextInput placeholder='Venue' name='venue'/>
                    <Button 
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={loading} 
                        floated='right' 
                        positive type='submit' 
                        content='Submit' 
                    />
                    <Button as={Link} to='/activities/' floated='right' type='button' content='Cancel' />
                </Form>
                )}
            </Formik>

        </Segment>
    )
})