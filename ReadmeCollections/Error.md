## Error Type
Runtime Error

## Error Message
Invalid src prop (https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop) on `next/image`, hostname "images.unsplash.com" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host


    at eval (src/components/room-sharing/SharingRoomList.jsx:256:19)
    at Array.map (<anonymous>:null:null)
    at SharingRoomList (src/components/room-sharing/SharingRoomList.jsx:253:27)
    at SharedRoomsPage (src/app/(dashboard)/shared-rooms/page.jsx:151:9)

## Code Frame
  254 |               <Card key={sharingRoom.id} className="overflow-hidden">
  255 |                 <div className="relative">
> 256 |                   <Image
      |                   ^
  257 |                     src={sharingRoom.room.images[0]}
  258 |                     alt={sharingRoom.room.title}
  259 |                     width={400}

Next.js version: 15.5.2 (Webpack)
