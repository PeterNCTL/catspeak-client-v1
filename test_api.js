const http = require("http")

async function testFetch(url) {
  try {
    const res = await fetch(url)
    const data = await res.json()
    console.log(`URL: ${url}`)
    if (data.data) {
      console.log(
        `Rooms count: ${data.data.length} | First room topic: ${data.data[0]?.topic}`,
      )
    } else {
      console.log(`Rooms count: undefined | status: ${data.status}`)
    }
  } catch (err) {
    console.log(`URL: ${url} error: ${err.message}`)
  }
}

async function run() {
  await testFetch("http://localhost:5173/api/rooms?pageSize=20")

  console.log('\n--- Testing "topic" multiple ---')
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topic=Productivity",
  )
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topic=Other&topic=Productivity",
  )

  console.log('\n--- Testing "topics" multiple ---')
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topics=Productivity",
  )
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topics=Productivity&topics=Other",
  )

  console.log('\n--- Testing "topics" comma separated ---')
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topics=Productivity,Other",
  )
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topics=Productivity, Other",
  )

  console.log('\n--- Testing "topic" comma separated ---')
  await testFetch(
    "http://localhost:5173/api/rooms?pageSize=20&topic=Productivity,Other",
  )
}

run()
