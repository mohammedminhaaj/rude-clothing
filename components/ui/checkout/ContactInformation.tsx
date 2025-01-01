import CheckoutStepCard from './CheckoutStepCard';
import AnimatedLink from '../AnimatedLink';
import { getUser } from '@/actions/auth';
import ContactinformationForm from '@/components/forms/ContactInformationForm';

const AnonymousUserView: React.FC<{ existingEmail: string | undefined }> = ({
    existingEmail,
}: {
    existingEmail: string | undefined;
}) => {

    return (
        <>
            <p className='text-xs md:text-sm inline text-gray-500'>
                Already have an account?
            </p>{' '}
            <AnimatedLink
                href='/login'
                text='Login'
                className='text-xs md:text-sm'
            />
            <ContactinformationForm existingEmail={existingEmail} />
        </>
    );
};

const LoggedInUserView: React.FC<{ email: string | undefined }> = ({
    email,
}: {
    email: string | undefined;
}) => {
    return (
        <>
            <p>Logged In user</p>
        </>
    );
};

const ContactInformation: React.FC = async () => {
    const { user } = await getUser();

    return (
        <CheckoutStepCard step={1} heading='Contact Information'>
            {!user || user.is_anonymous ? (
                <AnonymousUserView
                    existingEmail={user?.user_metadata?.email}
                />
            ) : (
                <LoggedInUserView email={user.email} />
            )}
        </CheckoutStepCard>
    );
};

export default ContactInformation;
