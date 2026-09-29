const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('volunteer_hub');
  
  const adminUser = await db.collection('users').findOne({ role: 'ADMIN' }) || await db.collection('users').findOne({});
  if (!adminUser) { console.log('No users found'); return; }

  let team = await db.collection('teams').findOne({ name: 'Головний Штаб' });
  const inviteCode = 'TEST-HUB-1';

  if (!team) {
    const res = await db.collection('teams').insertOne({
      name: 'Головний Штаб',
      inviteCode: inviteCode,
      coordinator: adminUser._id,
      members: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    team = await db.collection('teams').findOne({ _id: res.insertedId });
  }

  const allUsers = await db.collection('users').find({}).toArray();
  const userIds = allUsers.map(u => u._id);
  
  await db.collection('teams').updateOne(
    { _id: team._id },
    { $set: { members: userIds } }
  );

  await db.collection('users').updateMany(
    {},
    { $set: { teamId: team._id } }
  );

  await db.collection('missions').updateMany(
    {},
    { $set: { teamId: team._id } }
  );

  console.log('Migration successful. Invite code:', team.inviteCode);
  await client.close();
}

run();
