import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./contants";
import { Post } from "./entities/Post"
import mikroConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    
    const post = orm.em.create(Post, {title: 'my 3 post'})
    await orm.em.persistAndFlush(post);

    console.log(await orm.em.find(Post, {}));
};

main().catch( (err) => {
    console.error(err)
});

