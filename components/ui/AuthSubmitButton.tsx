import { Loader2 } from 'lucide-react';

type AuthSubmitButtonProps = {
    isSubmitting: boolean;
    text: string;
    textWhenSubmitting: string;
};

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
    isSubmitting,
    text,
    textWhenSubmitting,
}: AuthSubmitButtonProps) => (
    <button
        title={text}
        type='submit'
        disabled={isSubmitting}
        className='primary-button'
    >
        {isSubmitting ? (
            <span className='grid grid-cols-4 w-fit gap-2 mx-auto'>
                <Loader2 className='col-span-1 animate-spin' />
                <p className='col-span-3'>{textWhenSubmitting}</p>
            </span>
        ) : (
            text
        )}
    </button>
);

export default AuthSubmitButton;
