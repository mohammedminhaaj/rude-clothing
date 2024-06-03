import { getTags } from '@/actions/shop';
import TagSection from '@/components/ui/shop/TagSection';

const TagPage: React.FC = async () => {
	const tags = await getTags();
	return <TagSection tags={tags} />;
};

export default TagPage;
